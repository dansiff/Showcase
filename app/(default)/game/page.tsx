"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";

type GameKey = "tictactoe" | "memory" | "embed" | "snake" | "space";

export default function Page() {
	const [active, setActive] = useState<GameKey | null>(null);

	return (
		<div className="max-w-7xl mx-auto p-6 text-slate-100 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-xl shadow-xl">
			<header className="mb-8 text-center">
				<h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-400 to-violet-400 drop-shadow-xl">
					Arcade Snack Bar �🥙✨
				</h1>
				<p className="text-sm mt-4 max-w-3xl mx-auto text-slate-300">
					Mini interactive demos: canvas motion, logic, state & playful theming. Use arrows or WASD. Space / F / J / + to fire. Recharge your brain with code & tacos.
				</p>
			</header>

			<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
				<GameCard
					icon={<TacoIcon />}
					title="Tic Tac Taco"
					subtitle="Spicy X / O showdown"
					description="Classic duel with a crunchy twist — state transitions, win detection & reset logic."
					onOpen={() => setActive("tictactoe")}
				/>

				<GameCard
					icon={<DonutIcon />}
					title="Memory Munch"
					subtitle="Sweet pattern recall"
					description="Shuffle, flip, pair — demonstrates array transforms, effect timing & UX feedback."
					onOpen={() => setActive("memory")}
				/>

				<GameCard
					icon={<PizzaIcon />}
					title="Snake Snack"
					subtitle="Wiggle, gobble, grow"
					description="Canvas grid, wrap logic, collision & input (Arrows + WASD)."
					onOpen={() => setActive("snake")}
				/>

				<GameCard
					icon={<RocketIcon />}
					title="Space Invaders Jr."
					subtitle="Retro pixel barrage"
					description="Row marching AI, collision pruning & multi-key fire (Space/F/J/+)."
					onOpen={() => setActive("space")}
				/>

				<GameCard
					icon={<EmbedIcon />}
					title="Embed Play"
					subtitle="Portable build host"
					description="Iframe integration for WebGL/HTML5 deployments & sandboxed hosting." 
					onOpen={() => setActive("embed")}
				/>

				<GameCard
					icon={<SparkleIcon />}
					title="More to come"
					subtitle="Extend the arcade"
					description="Plug in physics, shaders, multiplayer or leaderboard components next."
					onOpen={() => setActive(null)}
				/>
			</section>

			<main className="rounded-2xl p-6 shadow-inner min-h-[380px] bg-gradient-to-br from-slate-800/70 via-indigo-800/60 to-purple-800/60 backdrop-blur-sm border border-slate-700">
				{!active && (
					<div className="text-center text-slate-300 animate-pulse">Select a snackable game above 🍱</div>
				)}

				{active === "tictactoe" && <TicTacToe />}
				{active === "memory" && <MemoryMatch />}
				{active === "embed" && <EmbedGame />}
				{active === "snake" && <SnakeGame />}
				{active === "space" && <SpaceInvaders />}
			</main>
		</div>
	);
}

function GameCard({
	icon,
	title,
	subtitle,
	description,
	onOpen,
}: {
	icon: React.ReactNode;
	title: string;
	subtitle?: string;
	description: string;
	onOpen: () => void;
}) {
	return (
		<div className="relative group rounded-2xl p-4 flex flex-col justify-between bg-gradient-to-br from-slate-800/80 via-indigo-700/70 to-purple-700/70 border border-indigo-600/40 hover:border-pink-400/60 transition-all hover:shadow-xl hover:shadow-pink-500/10 overflow-hidden">
			<div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)] transition-opacity" />
			<div className="flex items-start gap-3">
				<div className="w-14 h-14 rounded-lg bg-slate-900/80 flex items-center justify-center shadow-lg ring-1 ring-indigo-400/40 group-hover:ring-pink-300/60">{icon}</div>
				<div>
					<h3 className="font-semibold text-amber-200 drop-shadow-sm tracking-tight">{title}</h3>
					<div className="text-[10px] uppercase tracking-wide text-pink-300 font-medium">{subtitle}</div>
					<p className="text-xs text-slate-200/80 mt-2 leading-relaxed">{description}</p>
				</div>
			</div>
			<div className="mt-4 flex justify-end">
				<button onClick={onOpen} className="px-4 py-2 rounded-lg shadow bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-sm font-semibold tracking-wide hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-pink-300">Play ▶</button>
			</div>
		</div>
	);
}

/* ----------------- TicTacToe (small demo) ----------------- */

function TicTacToe() {
	const [board, setBoard] = useState<("X" | "O" | null)[]>(Array(9).fill(null));
	const [turn, setTurn] = useState<"X" | "O">("X");
	const winner = useMemo(() => calculateWinner(board), [board]);

	function handleClick(i: number) {
		if (board[i] || winner) return;
		const next = board.slice();
		next[i] = turn;
		setBoard(next);
		setTurn((t) => (t === "X" ? "O" : "X"));
	}

	function reset() {
		setBoard(Array(9).fill(null));
		setTurn("X");
	}

	return (
		<div className="animate-fade-in">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold text-amber-200" id="tictactoe-title">Tic Tac Taco</h2>
				<div className="text-sm text-gray-600" aria-live="polite" aria-label={`Current turn: ${turn}`}>Turn: {turn}</div>
			</div>

			<div className="grid grid-cols-3 gap-2 max-w-xs" role="grid" aria-labelledby="tictactoe-title">
				{board.map((v, i) => (
					<button
						key={i}
						onClick={() => handleClick(i)}
						aria-label={v ? `Cell ${i + 1}, ${v}` : `Cell ${i + 1}, empty`}
						disabled={!!v || !!winner}
						className="h-16 w-16 flex items-center justify-center border border-slate-600 text-2xl font-bold bg-slate-800/60 hover:bg-slate-700/70 rounded-lg shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{v}
					</button>
				))}
			</div>

			<div className="mt-4">
				{winner ? (
					<div className="text-emerald-400 font-semibold" role="alert" aria-live="assertive">Winner: {winner}</div>
				) : (
					<div className="text-slate-400" aria-live="polite">No winner yet</div>
				)}
				<div className="mt-2">
					<button
						onClick={reset}
						className="px-3 py-1 rounded bg-slate-700/70 hover:bg-slate-600 text-slate-100 text-xs"
						aria-label="Reset game"
					>
						Reset
					</button>
				</div>
			</div>
		</div>
	);
}

function calculateWinner(squares: ("X" | "O" | null)[]) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return squares[a];
		}
	}
	return null;
}

/* ----------------- Memory Match (small demo) ----------------- */

function MemoryMatch() {
	const pairCount = 6;
	const [cards, setCards] = useState<number[]>(() => shufflePairs(pairCount));
	const [flipped, setFlipped] = useState<number[]>([]);
	const [matched, setMatched] = useState<Record<number, boolean>>({});

	useEffect(() => {
		if (flipped.length === 2) {
			const [a, b] = flipped;
			if (cards[a] === cards[b]) {
				setMatched((m) => ({ ...m, [a]: true, [b]: true }));
				setFlipped([]);
			} else {
				const t = setTimeout(() => setFlipped([]), 700);
				return () => clearTimeout(t);
			}
		}
	}, [flipped, cards]);

	function handleFlip(i: number) {
		if (flipped.includes(i) || matched[i]) return;
		if (flipped.length === 2) return;
		setFlipped((f) => [...f, i]);
	}

	function reset() {
		setCards(shufflePairs(pairCount));
		setFlipped([]);
		setMatched({});
	}

	return (
		<div className="animate-fade-in">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold text-pink-300" id="memory-title">Memory Munch</h2>
				<div>
					<button
						onClick={reset}
						className="px-3 py-1 rounded bg-slate-700/70 hover:bg-slate-600 text-slate-100 text-xs"
						aria-label="Reset game"
					>
						Reset
					</button>
				</div>
			</div>

			<div className="grid grid-cols-4 gap-3 max-w-md" role="grid" aria-labelledby="memory-title">
				{cards.map((val, i) => {
					const isFlipped = flipped.includes(i) || matched[i];
					return (
						<button
							key={i}
							onClick={() => handleFlip(i)}
							aria-label={isFlipped ? `Card ${i+1}, showing ${val}` : `Card ${i+1}, hidden`}
							disabled={flipped.includes(i) || matched[i]}
							className={`h-20 border rounded flex items-center justify-center text-xl font-semibold transition-colors border-slate-600 disabled:cursor-not-allowed ${
								isFlipped ? "bg-indigo-600/40 text-white" : "bg-slate-800/60 text-slate-300"
							}`}
						>
							{isFlipped ? val : "?"}
						</button>
					);
				})}
			</div>
		</div>
	);
}

function shufflePairs(pairs: number) {
	const arr: number[] = [];
	for (let i = 1; i <= pairs; i++) {
		arr.push(i, i);
	}
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

/* ----------------- Embed external game (iframe) ----------------- */

function EmbedGame() {
	const [url, setUrl] = useState(
		"https://itch.io/embed-upload/0000000" /* replace with your build/hosted URL */
	);

	return (
		<div className="animate-fade-in">
			<h2 className="text-xl font-medium mb-3">Embedded Game</h2>
			<p className="text-sm text-gray-600 mb-3">
				Host a WebGL/HTML5 build (Unity, Phaser, Construct) and embed it via an
				iframe or use a platform like itch.io. This demonstrates integration,
				asset hosting and deployment.
			</p>

			<div className="mb-3">
				<label className="text-sm block mb-1">Embed URL</label>
				<input
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					className="w-full border rounded px-2 py-1 bg-slate-800/70 border-slate-600 text-slate-100"
				/>
			</div>

			<div className="w-full h-96 border border-slate-700 rounded bg-slate-900/70">
				<iframe src={url} title="embedded-game" className="w-full h-full" />
			</div>
		</div>
	);
}

/* ----------------- Explanatory notes (skills) ----------------- */

/* ----------------- Small SVG icons (food & fun) ----------------- */

function TacoIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-500">
			<path d="M2 12c0 5.523 4.477 10 10 10 2.5 0 4.8-.89 6.6-2.36C17.4 18.78 14.9 16 12 16s-5.4 2.78-6.6 3.64C5.2 21.11 3.9 22 1 22 1 18 2 14 2 12z" fill="currentColor" opacity="0.95"/>
			<circle cx="8.5" cy="11" r="1" fill="white" opacity="0.9" />
		</svg>
	);
}

function DonutIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-500">
			<circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.95" />
			<circle cx="12" cy="12" r="3" fill="white" />
		</svg>
	);
}

function PizzaIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
			<path d="M12 2 2 22h20L12 2z" fill="currentColor" opacity="0.95" />
			<circle cx="12" cy="12" r="1" fill="white" />
		</svg>
	);
}

function RocketIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500">
			<path d="M12 2s4 1 6 3c2 2 3 6 3 6s-4 .6-6 2c-2 1.4-4 3-6 3-2 0-3-2-3-2s1-4 3-6c2-2 6-6 6-6z" fill="currentColor" opacity="0.95" />
		</svg>
	);
}

function EmbedIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
			<rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor" opacity="0.95" />
			<circle cx="9" cy="12" r="1" fill="white" />
		</svg>
	);
}

function SparkleIcon() {
	return (
		<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-400">
			<path d="M12 2l1.6 3.8L17 7l-3.4 1.2L12 12 10.4 8.2 7 7l3.4-1.2L12 2z" fill="currentColor" />
		</svg>
	);
}

/* ----------------- Snake demo (simple canvas) ----------------- */

function SnakeGame() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [running, setRunning] = useState(true);
	const [score, setScore] = useState(1); // snake length
	const [highScore, setHighScore] = useState<number>(() => {
		if (typeof window === 'undefined') return 1;
		const v = window.localStorage.getItem('snakeHigh');
		return v ? parseInt(v) || 1 : 1;
	});
	const [paused, setPaused] = useState(false);
	const [muted, setMuted] = useState(false);
	const [leaderboard, setLeaderboard] = useState<{name?:string;score:number}[]>([]);
	const [showSubmit, setShowSubmit] = useState(false);
	const [submitName, setSubmitName] = useState('');
	// simple particle system state
	const particlesRef = useRef<{x:number;y:number;life:number;h:number}[]>([]);

	useEffect(() => {
		fetch('/api/game/scores?game=snake&limit=5').then(r=>r.json()).then(d=>setLeaderboard(d.scores||[])).catch(()=>{});
	}, []);

	// minimal sound synth using Web Audio API
	const audioCtxRef = useRef<AudioContext | null>(null);
	function beep(freq:number=440, dur=0.1, vol=0.2) {
		try {
			if (muted) return;
			if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
			const ctx = audioCtxRef.current;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.frequency.value = freq;
			osc.type = 'sine';
			gain.gain.value = vol;
			osc.connect(gain).connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + dur);
		} catch {}
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const c = canvas;
		const ctx = c.getContext("2d")!;

		const size = 16; // grid size
		const cols = 20;
		const rows = 15;
		c.width = cols * size;
		c.height = rows * size;

		let snake = [{ x: 5, y: 7 }];
		let dir = { x: 1, y: 0 };
		let apple = { x: 12, y: 7 };
		let speed = 200; // ms per step base
		let timer: number;

		function draw() {
			ctx.fillStyle = "#fff7ed";
			ctx.fillRect(0, 0, c.width, c.height);
			// apple
			ctx.fillStyle = "#ef4444";
			ctx.fillRect(apple.x * size, apple.y * size, size, size);
			// snake
			ctx.fillStyle = "#059669";
			snake.forEach((s, i) => {
				ctx.fillRect(s.x * size + 1, s.y * size + 1, size - 2, size - 2);
			});
			// particles
			particlesRef.current.forEach(p => {
				p.life -= 1;
				ctx.fillStyle = `hsl(${p.h},70%,60%)`;
				ctx.globalAlpha = Math.max(p.life/20,0);
				ctx.fillRect(p.x, p.y, 4,4);
				ctx.globalAlpha = 1;
			});
			particlesRef.current = particlesRef.current.filter(p=>p.life>0);
		}

		function step() {
			const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
			// wrap
			head.x = (head.x + cols) % cols;
			head.y = (head.y + rows) % rows;
			// collision with self
			if (snake.some((s) => s.x === head.x && s.y === head.y)) {
				setRunning(false);
				return;
			}
			snake.unshift(head);
			// trail particles each move
			particlesRef.current.push({ x: head.x*size + size/2, y: head.y*size + size/2, life:10, h:140 + Math.random()*40 });
			if (head.x === apple.x && head.y === apple.y) {
				apple = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
				setScore(snake.length);
				// difficulty ramp: decrease interval as snake grows
				speed = Math.max(60, 200 - snake.length * 4);
				beep(380 + snake.length*5, 0.08, 0.15);
				// spawn particles at head
				for (let i=0;i<12;i++) {
					particlesRef.current.push({
						x: head.x*size + Math.random()*size,
						y: head.y*size + Math.random()*size,
						life: 20+Math.random()*10,
						h: 100 + Math.random()*100
					});
				}
			} else {
				snake.pop();
			}
			draw();
			if (running && !paused) timer = window.setTimeout(step, speed);
		}

		function onKey(e: KeyboardEvent) {
			const k = e.key.toLowerCase();
			if (k === "arrowup" || k === "w") dir = { x: 0, y: -1 };
			if (k === "arrowdown" || k === "s") dir = { x: 0, y: 1 };
			if (k === "arrowleft" || k === "a") dir = { x: -1, y: 0 };
			if (k === "arrowright" || k === "d") dir = { x: 1, y: 0 };
			if (k === 'p') setPaused(p => !p);
			if (k === 'm') setMuted(m => !m);
		}

		window.addEventListener("keydown", onKey);
		draw();
		timer = window.setTimeout(step, speed);

		return () => {
			window.removeEventListener("keydown", onKey);
			clearTimeout(timer);
		};
	}, []);

	useEffect(() => {
		if (score > highScore) {
			setHighScore(score);
			try { window.localStorage.setItem('snakeHigh', String(score)); } catch {}
		}
		if (!running && score >= 10 && !showSubmit) {
			const topScore = leaderboard[0]?.score || 0;
			if (score > topScore || leaderboard.length < 5) setShowSubmit(true);
		}
	}, [score, highScore, running, leaderboard, showSubmit]);

	async function submitScore() {
		if (!submitName.trim()) return;
		try {
			await fetch('/api/game/scores', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({game:'snake',name:submitName.trim(),score}) });
			const res = await fetch('/api/game/scores?game=snake&limit=5');
			const data = await res.json();
			setLeaderboard(data.scores||[]);
			setShowSubmit(false);
		} catch(e) { console.error(e); }
	}

	return (
		<div className="animate-fade-in">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold text-lime-300" id="snake-title">Snake Snack</h2>
				<div className="flex items-center gap-3 text-[10px]" role="group" aria-label="Game controls and stats">
					<div className="px-2 py-1 rounded bg-lime-800/40 text-lime-200" aria-label={`Current length ${score}`}>Len {score}</div>
					<div className="px-2 py-1 rounded bg-lime-900/40 text-lime-300" aria-label={`Best length ${highScore}`}>Best {highScore}</div>
					<button onClick={() => setPaused(p=>!p)} className="px-2 py-1 rounded bg-slate-700/70 hover:bg-slate-600 text-slate-100" aria-label={paused?'Resume game':'Pause game'}>{paused? 'Resume':'Pause'}</button>
					<button onClick={() => setMuted(m=>!m)} className="px-2 py-1 rounded bg-slate-700/70 hover:bg-slate-600 text-slate-100" aria-label={muted?'Unmute sounds':'Mute sounds'}>{muted? 'Unmute':'Mute'}</button>
					<button onClick={() => window.location.reload()} className="px-2 py-1 rounded bg-slate-700/70 hover:bg-slate-600 text-slate-100" aria-label="Restart game">Restart</button>
				</div>
			</div>
			<div className="grid md:grid-cols-[1fr,200px] gap-4">
				<div className="overflow-auto">
					<canvas ref={canvasRef} className="border rounded" aria-label="Snake game canvas" role="img" />
					{!running && <div className="mt-3 text-red-400" role="alert" aria-live="assertive">Game over — press Restart</div>}
				</div>
				{leaderboard.length > 0 && (
					<aside className="bg-slate-800/40 rounded p-3 border border-slate-700" aria-labelledby="snake-leaderboard">
						<h3 className="text-xs font-semibold mb-2 text-lime-300" id="snake-leaderboard">Top Scores</h3>
						<ol className="text-[10px] space-y-1" aria-label="Snake leaderboard">
							{leaderboard.map((entry,i)=>(
								<li key={i} className="flex justify-between" aria-label={`Rank ${i+1}: ${entry.name||'Anonymous'} with score ${entry.score}`}>
									<span className="truncate">{i+1}. {entry.name||'Anon'}</span>
									<span className="font-mono">{entry.score}</span>
								</li>
							))}
						</ol>
					</aside>
				)}
			</div>
			{showSubmit && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" role="dialog" aria-labelledby="submit-dialog-title" aria-modal="true">
					<div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-slate-600">
						<h3 className="text-lg font-semibold text-lime-300 mb-3" id="submit-dialog-title">New High Score!</h3>
						<p className="text-sm text-slate-300 mb-4">Length: {score}. Enter your name for the leaderboard:</p>
						<input type="text" value={submitName} onChange={e=>setSubmitName(e.target.value)} maxLength={40} placeholder="Your name" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-600 text-slate-100 mb-4" aria-label="Enter your name" />
						<div className="flex gap-2">
							<button onClick={submitScore} className="flex-1 px-4 py-2 rounded bg-lime-600 hover:bg-lime-500 text-white" aria-label="Submit score">Submit</button>
							<button onClick={()=>setShowSubmit(false)} className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-100" aria-label="Skip submission">Skip</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

/* ----------------- Simple Space Invaders demo (very small) ----------------- */

function SpaceInvaders() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [score, setScore] = useState(0);
	const [wave, setWave] = useState(1);
	const [highScore, setHighScore] = useState<number>(() => {
		if (typeof window === 'undefined') return 0;
		const v = window.localStorage.getItem('invadersHigh');
		return v ? parseInt(v) || 0 : 0;
	});
	const [paused, setPaused] = useState(false);
	const [muted, setMuted] = useState(false);
	const [leaderboard, setLeaderboard] = useState<{name?:string;score:number}[]>([]);
	const [showSubmit, setShowSubmit] = useState(false);
	const [submitName, setSubmitName] = useState('');
	const [gameOver, setGameOver] = useState(false);
	const particlesRef = useRef<{x:number;y:number;life:number}[]>([]);

	useEffect(() => {
		fetch('/api/game/scores?game=invaders&limit=5').then(r=>r.json()).then(d=>setLeaderboard(d.scores||[])).catch(()=>{});
	}, []);
	const audioCtxRef = useRef<AudioContext | null>(null);
	function blip(freq=520, dur=0.07, vol=0.25) {
		try {
			if (muted) return;
			if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
			const ctx = audioCtxRef.current;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.frequency.value = freq;
			osc.type = 'square';
			gain.gain.value = vol;
			osc.connect(gain).connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + dur);
		} catch {}
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const c = canvas;
		const ctx = c.getContext("2d")!;

		const w = 480;
		const h = 320;
		c.width = w;
		c.height = h;

		let player = { x: w / 2 - 15, y: h - 40, w: 30, h: 10 };
		let bullets: { x: number; y: number }[] = [];
		let enemies: { x: number; y: number; alive: boolean }[] = [];
		const cols = 6;
		const rows = 3;
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				enemies.push({ x: 40 + c * 60, y: 30 + r * 40, alive: true });
			}
		}

		let dir = 1;
		let anim = true;

		function draw() {
			ctx.fillStyle = "#01030f";
			ctx.fillRect(0, 0, w, h);
			// player
			ctx.fillStyle = "#60a5fa";
			ctx.fillRect(player.x, player.y, player.w, player.h);
			// bullets
			ctx.fillStyle = "#fca5a5";
			bullets.forEach((b) => ctx.fillRect(b.x - 2, b.y, 4, 8));
			// enemies
			ctx.fillStyle = "#f59e0b";
			enemies.forEach((e) => {
				if (e.alive) ctx.fillRect(e.x - 12, e.y - 8, 24, 16);
			});
			// particles
			particlesRef.current.forEach(p => {
				p.life -= 1;
				ctx.globalAlpha = Math.max(p.life/15,0);
				ctx.fillStyle = '#f97316';
				ctx.fillRect(p.x, p.y, 3,3);
				ctx.globalAlpha = 1;
			});
			particlesRef.current = particlesRef.current.filter(p=>p.life>0);
			// HUD
			ctx.fillStyle = '#fff';
			ctx.font = '12px monospace';
			ctx.fillText(`Score: ${score} Wave: ${wave}`, 10, h-10);
		}

		function step() {
			if (paused) { if (anim) requestAnimationFrame(step); return; }
			// move enemies
			let leftMost = Math.min(...enemies.filter(e=>e.alive).map(e=>e.x)) || 0;
			let rightMost = Math.max(...enemies.filter(e=>e.alive).map(e=>e.x)) || w;
			if (rightMost > w - 20 || leftMost < 20) dir *= -1;
			const aliveCount = enemies.filter(e=>e.alive).length;
			const speedMultiplier = 1 + (wave-1)*0.3 + (Math.max(0,(cols*rows - aliveCount)) * 0.02);
			enemies.forEach((e) => (e.x += dir * (4 * speedMultiplier)));
			bullets.forEach((b) => (b.y -= 6));
			bullets = bullets.filter((b) => b.y > 0);
			// collisions
			bullets.forEach((b) => {
				enemies.forEach((e) => {
					if (!e.alive) return;
					if (b.x > e.x - 12 && b.x < e.x + 12 && b.y > e.y - 8 && b.y < e.y + 8) {
						e.alive = false;
						b.y = -1000;
						setScore(s => s + 10);
						blip(350 + Math.random()*100, 0.09, 0.2);
						for (let i=0;i<10;i++) particlesRef.current.push({x:e.x + (Math.random()*24-12), y:e.y + (Math.random()*16-8), life:15+Math.random()*10});
					}
				});
			});
			// wave clear
			if (enemies.every(e=>!e.alive)) {
				setWave(wv => wv + 1);
				blip(700,0.2,0.3);
				for (let r = 0; r < rows; r++) {
					for (let cIdx = 0; cIdx < cols; cIdx++) {
						enemies.push({ x: 40 + cIdx * 60, y: 30 + r * 40, alive: true });
					}
				}
			}
			draw();
			if (anim) requestAnimationFrame(step);
		}

		function onKey(e: KeyboardEvent) {
			const k = e.key.toLowerCase();
			if (k === "arrowleft" || k === "a") player.x -= 10;
			if (k === "arrowright" || k === "d") player.x += 10;
			if (k === " " || k === "f" || k === "j" || e.code === "NumpadAdd" || k === "+") { bullets.push({ x: player.x + player.w / 2, y: player.y }); blip(); }
			if (k === 'p') setPaused(p=>!p);
			if (k === 'm') setMuted(m=>!m);
			// clamp
			player.x = Math.max(0, Math.min(player.x, w - player.w));
		}

		window.addEventListener("keydown", onKey);
		draw();
		requestAnimationFrame(step);

		return () => {
			window.removeEventListener("keydown", onKey);
			anim = false;
		};
	}, []);

	useEffect(() => {
		if (score > highScore) {
			setHighScore(score);
			try { window.localStorage.setItem('invadersHigh', String(score)); } catch {}
		}
		if (gameOver && score >= 50 && !showSubmit) {
			const topScore = leaderboard[0]?.score || 0;
			if (score > topScore || leaderboard.length < 5) setShowSubmit(true);
		}
	}, [score, highScore, gameOver, leaderboard, showSubmit]);

	async function submitScore() {
		if (!submitName.trim()) return;
		try {
			await fetch('/api/game/scores', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({game:'invaders',name:submitName.trim(),score}) });
			const res = await fetch('/api/game/scores?game=invaders&limit=5');
			const data = await res.json();
			setLeaderboard(data.scores||[]);
			setShowSubmit(false);
		} catch(e) { console.error(e); }
	}

	return (
		<div className="animate-fade-in">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold text-violet-300" id="invaders-title">Space Invaders Jr.</h2>
				<div className="flex flex-col items-end gap-1 text-[10px]">
					<div className="text-slate-400" role="note">←/→/A/D move • Space/F/J/+ fire • P pause • M mute</div>
					<div className="flex gap-2" role="group" aria-label="Game stats and controls">
						<div className="px-2 py-1 rounded bg-violet-800/40 text-violet-200" aria-label={`Current score ${score}`}>Score {score}</div>
						<div className="px-2 py-1 rounded bg-violet-900/40 text-violet-300" aria-label={`High score ${highScore}`}>High {highScore}</div>
						<div className="px-2 py-1 rounded bg-pink-800/40 text-pink-200" aria-label={`Wave ${wave}`}>Wave {wave}</div>
						<button onClick={() => setPaused(p=>!p)} className="px-2 py-1 rounded bg-slate-700/70 hover:bg-slate-600 text-slate-100" aria-label={paused?'Resume game':'Pause game'}>{paused? 'Resume':'Pause'}</button>
						<button onClick={() => setMuted(m=>!m)} className="px-2 py-1 rounded bg-slate-700/70 hover:bg-slate-600 text-slate-100" aria-label={muted?'Unmute sounds':'Mute sounds'}>{muted? 'Unmute':'Mute'}</button>
					</div>
				</div>
			</div>
			<div className="grid md:grid-cols-[1fr,200px] gap-4">
				<div className="overflow-auto">
					<canvas ref={canvasRef} className="border border-slate-700 rounded w-full max-w-[480px] bg-slate-900/80" aria-label="Space Invaders game canvas" role="img" />
				</div>
				{leaderboard.length > 0 && (
					<aside className="bg-slate-800/40 rounded p-3 border border-slate-700" aria-labelledby="invaders-leaderboard">
						<h3 className="text-xs font-semibold mb-2 text-violet-300" id="invaders-leaderboard">Top Scores</h3>
						<ol className="text-[10px] space-y-1" aria-label="Invaders leaderboard">
							{leaderboard.map((entry,i)=>(
								<li key={i} className="flex justify-between" aria-label={`Rank ${i+1}: ${entry.name||'Anonymous'} with score ${entry.score}`}>
									<span className="truncate">{i+1}. {entry.name||'Anon'}</span>
									<span className="font-mono">{entry.score}</span>
								</li>
							))}
						</ol>
					</aside>
				)}
			</div>
			{showSubmit && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" role="dialog" aria-labelledby="invaders-submit-title" aria-modal="true">
					<div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-slate-600">
						<h3 className="text-lg font-semibold text-violet-300 mb-3" id="invaders-submit-title">New High Score!</h3>
						<p className="text-sm text-slate-300 mb-4">Score: {score}. Enter your name for the leaderboard:</p>
						<input type="text" value={submitName} onChange={e=>setSubmitName(e.target.value)} maxLength={40} placeholder="Your name" className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-600 text-slate-100 mb-4" aria-label="Enter your name" />
						<div className="flex gap-2">
							<button onClick={submitScore} className="flex-1 px-4 py-2 rounded bg-violet-600 hover:bg-violet-500 text-white" aria-label="Submit score">Submit</button>
							<button onClick={()=>setShowSubmit(false)} className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-100" aria-label="Skip submission">Skip</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

const GameNotes = () => (
	<div className="mt-6 text-sm text-gray-600">
		<h3 className="font-semibold">Ideas to showcase skills</h3>
		<ul className="list-disc ml-5 mt-2">
			<li>React state & hooks (game logic, timers, undo/redo)</li>
			<li>Canvas or WebGL (performance, animations) — e.g. particle systems, Snake</li>
			<li>Physics/Math (vector movement, collision detection)</li>
			<li>Integrations: Embed Unity/Phaser builds or link to itch.io</li>
			<li>Accessibility: keyboard controls, focus management</li>
			<li>Testing: unit tests for game logic, E2E for UI interactions</li>
			<li>Deployment: host on Netlify/Vercel and show CI/CD for builds</li>
		</ul>
	</div>
);

