// Palavras de 5 letras, sem acento
export const PALAVRAS = `
amigo falar mundo tempo ainda coisa sobre sonho carta festa livro porta praia folha nuvem
campo terra fruta verde preto baixo fundo corpo noite tarde chuva vento sorte jogar gente
feliz forte navio piano pedra carro barco prato garfo salto banco lugar olhar ouvir dizer
fazer poder saber viver comer beber andar nadar sinal papel metal vidro areia ponte torre
plano ideia honra causa forma parte grupo ordem moeda troca nobre leite limao melao manga
cacau mosca cobra zebra tigre touro burro pombo corvo peixe polvo lebre cisne ganso bicho
dente braco perna costa testa nariz mente humor calor brisa clima etapa prova aluno curso
texto letra frase termo verso poema canto samba danca filme palco circo bolsa roupa calca
colar relva pomar horta milho arroz carne doces sabor aroma fogao forno
`.trim().split(/\s+/).map((p) => p.toUpperCase());
