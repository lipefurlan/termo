"use client";

import { useCallback, useEffect, useState } from "react";
import { PALAVRAS } from "./palavras";

type Cor = "certo" | "lugar" | "errado";
const TENTATIVAS = 6;
const TECLADO = ["QWERTYUIOP", "ASDFGHJKL", "⌫ZXCVBNM↵"];

function sortear() {
  return PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
}

function avaliar(chute: string, resposta: string): Cor[] {
  const cores: Cor[] = Array(5).fill("errado");
  const sobra: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    if (chute[i] === resposta[i]) cores[i] = "certo";
    else sobra[resposta[i]] = (sobra[resposta[i]] ?? 0) + 1;
  }
  for (let i = 0; i < 5; i++) {
    if (cores[i] !== "certo" && sobra[chute[i]]) {
      cores[i] = "lugar";
      sobra[chute[i]]--;
    }
  }
  return cores;
}

const COR_TILE: Record<Cor, string> = {
  certo: "bg-[#3aa394] border-[#3aa394]",
  lugar: "bg-[#d3ad69] border-[#d3ad69]",
  errado: "bg-[#312a2c] border-[#312a2c]",
};
const PRIORIDADE: Record<Cor, number> = { errado: 1, lugar: 2, certo: 3 };

export default function Termo() {
  const [resposta, setResposta] = useState("");
  const [chutes, setChutes] = useState<string[]>([]);
  const [atual, setAtual] = useState("");
  const [msg, setMsg] = useState("");
  const [tremer, setTremer] = useState(false);

  const novoJogo = useCallback(() => {
    setResposta(sortear());
    setChutes([]);
    setAtual("");
    setMsg("");
  }, []);

  useEffect(novoJogo, [novoJogo]);

  const venceu = chutes.at(-1) === resposta && resposta !== "";
  const acabou = venceu || chutes.length >= TENTATIVAS;

  const tecla = useCallback(
    (k: string) => {
      if (acabou) return;
      if (k === "⌫") return setAtual((a) => a.slice(0, -1));
      if (k === "↵") {
        if (atual.length < 5) {
          setMsg("Só palavras com 5 letras");
          setTremer(true);
          setTimeout(() => setTremer(false), 400);
          return;
        }
        const novos = [...chutes, atual];
        setChutes(novos);
        setAtual("");
        if (atual === resposta) setMsg(["Genial!", "Fantástico!", "Extraordinário!", "Fenomenal!", "Impressionante!", "Ufa!"][novos.length - 1]);
        else if (novos.length >= TENTATIVAS) setMsg(`A palavra era ${resposta}`);
        else setMsg("");
        return;
      }
      if (/^[A-Z]$/.test(k)) setAtual((a) => (a.length < 5 ? a + k : a));
    },
    [acabou, atual, chutes, resposta]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") tecla("↵");
      else if (e.key === "Backspace") tecla("⌫");
      else tecla(e.key.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase());
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tecla]);

  const corTecla: Record<string, Cor> = {};
  for (const c of chutes) {
    avaliar(c, resposta).forEach((cor, i) => {
      const l = c[i];
      if (!corTecla[l] || PRIORIDADE[cor] > PRIORIDADE[corTecla[l]]) corTecla[l] = cor;
    });
  }

  const linhas = Array.from({ length: TENTATIVAS }, (_, r) => {
    if (r < chutes.length) return { texto: chutes[r], cores: avaliar(chutes[r], resposta) };
    if (r === chutes.length && !acabou) return { texto: atual, cores: null, ativa: true };
    return { texto: "", cores: null };
  });

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-between gap-4 px-2 py-4">
      <header className="flex w-full items-center justify-between px-2">
        <span className="w-24" />
        <h1 className="text-4xl font-black tracking-[0.15em]">TERMO</h1>
        <button onClick={novoJogo} className="w-24 rounded-lg bg-[#4c4347] px-3 py-2 text-sm font-bold uppercase active:scale-95">
          Novo jogo
        </button>
      </header>

      <div className="flex h-8 items-center">
        {msg && <p className="rounded-lg bg-[#009afe] px-4 py-1 font-bold">{msg}</p>}
      </div>

      <div className="grid gap-1.5">
        {linhas.map((l, r) => (
          <div key={r} className={`grid grid-cols-5 gap-1.5 ${l.ativa && tremer ? "animate-[tremer_0.4s]" : ""}`}>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`flex size-14 items-center justify-center rounded-lg border-4 text-3xl font-black uppercase sm:size-16 ${
                  l.cores
                    ? COR_TILE[l.cores[i]]
                    : l.ativa
                    ? `border-[#4c4347] ${l.texto[i] ? "border-b-[10px]" : ""}`
                    : "border-transparent bg-[#615458]"
                }`}
              >
                {l.texto[i] ?? ""}
              </div>
            ))}
          </div>
        ))}
      </div>

      {acabou && (
        <button onClick={novoJogo} className="rounded-lg bg-[#3aa394] px-6 py-3 text-lg font-bold active:scale-95">
          Jogar de novo
        </button>
      )}

      <div className="flex w-full flex-col gap-1.5">
        {TECLADO.map((linha) => (
          <div key={linha} className="flex justify-center gap-1.5">
            {[...linha].map((k) => {
              const cor = corTecla[k];
              return (
                <button
                  key={k}
                  onClick={() => tecla(k)}
                  className={`flex h-14 items-center justify-center rounded-md text-lg font-bold active:scale-95 ${
                    k === "⌫" || k === "↵" ? "flex-[1.5] text-2xl" : "flex-1"
                  } ${cor ? COR_TILE[cor] : "bg-[#4c4347]"}`}
                >
                  {k}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}
