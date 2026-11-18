import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Sparkles, 
  CheckCircle2, 
  Table, 
  Info, 
  Copy, 
  Check, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface FormattedDescriptionProps {
  content: string;
  accentColor?: string;
}

export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({
  content,
  accentColor = '#38bdf8'
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Párrafos con espaciado y tipografía clara
          p: ({ children }) => {
            return (
              <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal my-3">
                {children}
              </p>
            );
          },

          // Títulos H1 a H4 estilizados tipo Badge / Sección
          h1: ({ children }) => (
            <h1 className="text-xl md:text-2xl font-black text-white mt-6 mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
              <span className="w-2 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
              <span>{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg md:text-xl font-extrabold text-white mt-5 mb-2.5 flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: accentColor }} />
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base md:text-lg font-bold text-slate-100 mt-4 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
              <span>{children}</span>
            </h3>
          ),

          // Listas no ordenadas transformadas en Feature Cards interactivas
          ul: ({ children }) => (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 my-4">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.08] transition-all group">
              <CheckCircle2 
                className="w-4 h-4 mt-0.5 shrink-0 transition-transform group-hover:scale-110" 
                style={{ color: accentColor }} 
              />
              <span className="text-xs md:text-sm text-slate-200 leading-snug">
                {children}
              </span>
            </li>
          ),

          // Tablas Markdown convertidas en Tarjetas Técnicas / Grillas Glassmorphism
          table: ({ children }) => (
            <div className="my-6 overflow-hidden rounded-2xl border border-white/15 bg-slate-900/90 shadow-xl">
              <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
                <Table className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span>Especificaciones Técnicas & Requisitos</span>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs md:text-sm border-collapse">
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-black/30 border-b border-white/10 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-3 font-semibold text-white whitespace-nowrap">
              {children}
            </th>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
              {children}
            </tr>
          ),
          td: ({ children }) => (
            <td className="p-3 text-slate-200 align-top">
              {children}
            </td>
          ),

          // Citas en bloque (Blockquotes) convertidas en Callouts / Destacados Pro
          blockquote: ({ children }) => (
            <blockquote className="my-4 p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-purple-500/5 to-transparent border-l-4 border-sky-400 text-slate-300 italic text-xs md:text-sm relative overflow-hidden">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 shrink-0 text-sky-400 not-italic mt-0.5" />
                <div className="not-italic leading-relaxed">{children}</div>
              </div>
            </blockquote>
          ),

          // Código / Snippets con botón de copiado rápido
          code: ({ children, className }) => {
            const isInline = !className;
            const codeString = String(children).replace(/\n$/, '');

            if (isInline) {
              return (
                <code 
                  className="px-2 py-0.5 rounded-lg bg-black/40 text-xs font-mono border border-white/10 font-bold"
                  style={{ color: accentColor }}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="my-3 rounded-2xl bg-black/60 border border-white/15 overflow-hidden font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 text-slate-400 text-[10px]">
                  <span>Comando / Snippet</span>
                  <button
                    onClick={() => handleCopy(codeString)}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedText === codeString ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 overflow-x-auto text-slate-200">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },

          // Links interactivos con ícono externo
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 hover:underline font-medium transition-colors"
            >
              <span>{children}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
