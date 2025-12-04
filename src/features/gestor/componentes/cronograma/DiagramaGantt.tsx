import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import gantt from "dhtmlx-gantt"; 
import "dhtmlx-gantt/codebase/dhtmlxgantt.css"; 

// interface para o formato de uma sub-etapa vinda da API
interface SubtaskAPI {
  substageName: string;
  startDate: string; 
  endDate?: string; 
  duration?: number; 
  progress?: number; 
}

// interface para o formato de uma etapa pai vinda da API
interface StageAPI {
  id_physicalSchedule?: number;
  stageName: string;
  stageId: number;
  summaryStartDate?: string | null; 
  summaryEndDate?: string | null; 
  tasks: SubtaskAPI[]; 
}

// propriedades do componente DiagramaGantt
interface DiagramaGanttProps {
  id_work: number; 
  onChangeStats?: (stats: { dentro: string; adiantadas: string; atrasadas: string }) => void;
}

export function DiagramaGantt({ id_work, onChangeStats }: DiagramaGanttProps) {
  
  const ganttRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // funcao para converter strings ou objetos Date em objetos Date consistentes (sem hora/fuso)
  const parseDate = (d?: string | Date | null): Date | null => {
    if (!d) return null;
    // converte string para Date; se já for Date, usa o objeto
    const dt = typeof d === "string" ? new Date(d) : d;
    if (isNaN(dt.getTime())) return null;
    // retorna uma nova Date com hora zerada para evitar problemas de fuso 
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  };

  // funcao para formatar um objeto Date em string no formato YYYY-MM-DD 
  const formatIso = (d: Date | null): string | null => {
    if (!d || isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0"); 
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // funcao para calcular a diferença em dias (número inteiro) entre duas datas
  const daysBetween = (start: Date, end: Date) => {
    const ms = end.getTime() - start.getTime(); 
    return Math.max(0, Math.ceil(ms / 86400000));
  };

  // ---------- GANTT INIT ----------
  useEffect(() => {
    if (!ganttRef.current) return;

    // configurações para modo somente leitura
    gantt.config.readonly = true;
    gantt.config.drag_move = false;
    gantt.config.drag_resize = false;
    gantt.config.drag_progress = false;
    gantt.config.autoscroll = true;
    gantt.config.show_errors = true;

    //gantt.config.xml_date = "%Y-%m-%d";

    // config das colunas da tabela
    gantt.config.columns = [
      { name: "text", label: "Etapa / Subetapa", width: 300, tree: true }, // Coluna principal com estrutura de árvore (pai/filho)
      { name: "start_date", label: "Início", width: 100 }, // Data de início
      { name: "end_date", label: "Término", width: 100 }, // Data de término
      {
        name: "progress",
        label: "Progresso",
        width: 90,
        align: "center",
        template: (t: any) => `${((t.progress || 0) * 100).toFixed(0)}%`,
      },
    ];

    // inicializa o diagrama de Gantt no elemento referenciado
    gantt.init(ganttRef.current);
    return () => gantt.clearAll();
  }, []); 

  // ---------- LOAD DATA ----------
  useEffect(() => {
    let mounted = true; 

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // requisição da API para buscar o cronograma
        const resp = await fetch(`http://localhost:8080/physicalSchedule/list/${id_work}`);
        const ct = resp.headers.get("content-type");

        // verifica se a resposta é JSON
        if (!ct || !ct.includes("application/json")) {
          const text = await resp.text();
          console.error("Resposta não JSON:", text);
          setError("O servidor retornou uma resposta inválida.");
          setLoading(false);
          return;
        }

        if (!resp.ok) throw new Error(`Erro ${resp.status}`);
        // comnverte a resposta JSON para o formato StageAPI[]
        const payload: StageAPI[] = await resp.json();

        console.log("DADOS: ", payload)

        const tasks: any[] = []; // array para armazenar tarefas do Gantt 
        const links: any[] = []; 

        // loop para processar cada etapa pai 
        for (const stage of payload) {
          const stageId = `s-${stage.stageId}`; // ID unico da etapa pai
          // converte as datas de resumo para objetos Date seguros
          let sStart = parseDate(stage.summaryStartDate);
          let sEnd = parseDate(stage.summaryEndDate);

          // se as datas de resumo nao existirem, calcula o range a partir das sub-tarefas
          if ((!sStart || !sEnd) && stage.tasks.length > 0) {
            let minD: Date | null = null;
            let maxD: Date | null = null;

            for (const stask of stage.tasks) {
              const st = parseDate(stask.startDate);
              let en = stask.endDate ? parseDate(stask.endDate) : null;

              // se nao houver data de termino, calcula usando a duracao
              if (!en && stask.duration && st) {
                en = new Date(st.getFullYear(), st.getMonth(), st.getDate() + stask.duration);
              }

              if (!st) continue;
              // encontra a data minima (inicio mais cedo)
              if (!minD || st < minD) minD = st;
              // encontra a data maxima (termino mais tarde)
              if (en && (!maxD || en > maxD)) maxD = en;
            }

            sStart = minD || null;
            sEnd = maxD || null;
          }

          // adiciona a etapa pai ao array de tasks
          tasks.push({
            id: stageId,
            text: stage.stageName,
            start_date: sStart || undefined, 
            end_date: sEnd || undefined,    // formata para string YYYY-MM-DD
            type: "project", 
            open: true,
          });

          // ---------- SUBTASKS ----------
          // loop para processar cada sub-etapa 
          for (const [i, sub] of stage.tasks.entries()) {
            const st = parseDate(sub.startDate);
            let en = sub.endDate ? parseDate(sub.endDate) : null;

            // recalcula end_date se estiver ausente e duration estiver presente
            if (!en && sub.duration && st) {
              en = new Date(st.getFullYear(), st.getMonth(), st.getDate() + sub.duration);
            }
            if (!st) continue; 

            // calcula a duracao em dias
            const duration = en ? daysBetween(st, en) : sub.duration;
            
            // adiciona a sub-etapa (task) ao array de tasks
            tasks.push({
              id: `ss-${stage.stageId}-${i}`,
              text: sub.substageName,
              start_date: st || undefined, 
              end_date: en || undefined,
              duration,                   
              parent: stageId, // vincula a etapa pai 
              progress: sub.progress ?? 0, 
              //verifica pra ver se n esta passando mais de 100% tp recebe 25 de progresso e o gannt passa como 2500% na tabela
              //progress: (sub.progress && sub.progress > 1) ? sub.progress / 100 : (sub.progress ?? 0),
              type: "task", 
            });
          }
        }

        if (!mounted) return; 

        // garantir que datas nulas sejam strings vazias e duration seja um numero positivo
        const safeTasks = tasks.map((t) => ({
          ...t,
          start_date: t.start_date ?? "", 
          end_date: t.end_date ?? "",     
          duration: t.duration || 1, 
        }));

        gantt.clearAll(); 
        console.log("SAFE TASKS =>", safeTasks); 
        gantt.parse({ data: safeTasks, links }); 

        // callback para reportar as estatísticas calculadas
        onChangeStats?.(calcStats(tasks));
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        if (!mounted) return;
        setError(err.message || "Erro ao carregar cronograma");
        setLoading(false);
      }
    };

    load();
  
    return () => {
      mounted = false;
    };
  }, [id_work]); 

  // exibe loading, erro ou o próprio Gantt
  if (loading) return <div>Carregando cronograma...</div>;
  if (error) return <div className="text-red-600">Erro: {error}</div>;

  // elemento onde o dhtmlx-gantt sera injetado
  return <div ref={ganttRef} style={{ width: "100%", height: "480px" }} />;
}

// ---------- UTILS ----------
// funcao para formatar data como DD/MM/YYYY, usada nas estatísticas
function formatDate(d: any) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
}

// funcao para calcular estatisticas de prazo (atrasadas, adiantadas, dentro)
function calcStats(tasks: any[]) {
  const hoje = new Date(); 
  let atrasadas = 0,
      adiantadas = 0,
      dentro = 0;

  // filtra apenas as tarefas que possuem um pai para o calculo
  const folhas = tasks.filter((t: any) => t.parent);
  if (folhas.length === 0)
    return { dentro: "0.00", adiantadas: "0.00", atrasadas: "0.00" };

  for (const t of folhas) {
    // converte a data de inicio de string para Date
    const st = t.start_date ? new Date(t.start_date) : null;
    const en = t.end_date
      ? new Date(t.end_date)
      : t.duration && st
      ? new Date(st.getFullYear(), st.getMonth(), st.getDate() + t.duration)
      : null;

    const prog = t.progress ?? 0; 
    if (!en) {
      dentro++; 
      continue;
    }

    // logica de status:
    if (prog < 1 && en < hoje) atrasadas++; // se progresso incompleto E data de termino passou
    else if (prog === 1 && en > hoje) adiantadas++; // se progresso completo E data de termino ainda nao passou
    else dentro++; // nos demais casos (em andamento dentro do prazo, ou completo no prazo)
  }

  const total = folhas.length;
  return {
    atrasadas: ((atrasadas / total) * 100).toFixed(2),
    adiantadas: ((adiantadas / total) * 100).toFixed(2),
    dentro: ((dentro / total) * 100).toFixed(2),
  };
}
