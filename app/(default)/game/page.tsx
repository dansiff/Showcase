"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";

type GameKey = "tictactoe" | "memory" | "embed" | "snake" | "space";

export default function Page() {
	const [active, setActive] = useState<GameKey | null>(null);

	return (
		<div className="max-w-5xl mx-auto p-6">
			<header className="mb-6 text-center">
				<h1 className="text-4xl font-extrabold tracking-tight">Fun Games for Kids 🍩🌮🍕</h1>
				<p className="text-sm text-gray-400 mt-2 max-w-2xl mx-auto">
					Play quick, friendly demos built with React — perfect to showcase UI
					interactivity, canvas skills and fun animations. Pick a game and enjoy!
				</p>
			</header>

			<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
				<GameCard
					icon={<TacoIcon />}
					title="Tic Tac Taco"
					subtitle="X/O with a taco twist"
					description="Classic X/O — shows React state, game logic and win detection."
					onOpen={() => setActive("tictactoe")}
				/>

				<GameCard
					icon={<DonutIcon />}
					title="Memory Munch"
					subtitle="Match yummy treats"
					description="A card-matching game — state, shuffle and friendly UX."
					onOpen={() => setActive("memory")}
				/>

				<GameCard
					icon={<PizzaIcon />}
					title="Snake Snack"
					subtitle="Chomp to grow"
					description="A simple Snake game using canvas."
					onOpen={() => setActive("snake")}
				/>

				<GameCard
					icon={<RocketIcon />}
					title="Space Invaders Jr."
					subtitle="Blast the aliens"
					description="Mini Space Invaders demo with colorful sprites."
					onOpen={() => setActive("space")}
				/>

				<GameCard
					icon={<EmbedIcon />}
					title="Embed Play"
					subtitle="Embed an external build"
					description="Host and embed a WebGL/HTML5 build via iframe."
					onOpen={() => setActive("embed")}
				/>

				<GameCard
					icon={<SparkleIcon />}
					title="More to come"
					subtitle="Add your own"
					description="Drop in more demos — physics, canvas, WebGL and interactive fun."
					onOpen={() => setActive(null)}
				/>
			</section>

			<main className="bg-white rounded-2xl p-6 shadow-md min-h-[360px]">
				{!active && (
					<div className="text-center text-gray-500">Select a game from above to try it.</div>
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
		<div className="bg-gradient-to-br from-yellow-50 to-pink-50 border border-yellow-200 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform">
			<div className="flex items-start gap-3">
				<div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center shadow-sm">{icon}</div>
				<div>
					<h3 className="font-semibold">{title}</h3>
					<div className="text-xs text-indigo-600">{subtitle}</div>
					<p className="text-sm text-gray-600 mt-2">{description}</p>
				</div>
			</div>
			<div className="mt-4 flex justify-end">
				<button onClick={onOpen} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow">
					Play
				</button>
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
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-medium">Tic Tac Toe</h2>
				<div className="text-sm text-gray-600">Turn: {turn}</div>
			</div>

			<div className="grid grid-cols-3 gap-2 max-w-xs">
				{board.map((v, i) => (
					<button
						key={i}
						onClick={() => handleClick(i)}
						aria-label={`Cell ${i + 1}`}
						className="h-16 w-16 flex items-center justify-center border text-2xl font-bold bg-gray-50 hover:bg-gray-100"
					>
						{v}
					</button>
				))}
			</div>

			<div className="mt-4">
				{winner ? (
					<div className="text-green-700">Winner: {winner}</div>
				) : (
					<div className="text-gray-600">No winner yet</div>
				)}
				<div className="mt-2">
					<button
						onClick={reset}
						className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
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
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-medium">Memory Match</h2>
				<div>
					<button
						onClick={reset}
						className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
					>
						Reset
					</button>
				</div>
			</div>

			<div className="grid grid-cols-4 gap-3 max-w-md">
				{cards.map((val, i) => {
					const isFlipped = flipped.includes(i) || matched[i];
					return (
						<button
							key={i}
							onClick={() => handleFlip(i)}
							className={`h-20 border rounded flex items-center justify-center text-xl font-semibold bg-white ${
								isFlipped ? "bg-indigo-50" : "bg-gray-50"
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
		<div>
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
					className="w-full border rounded px-2 py-1"
				/>
			</div>

			<div className="w-full h-96 border">
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
		let speed = 200;
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
			if (head.x === apple.x && head.y === apple.y) {
				apple = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
			} else {
				snake.pop();
			}
			draw();
			timer = window.setTimeout(step, speed);
		}

		function onKey(e: KeyboardEvent) {
			if (e.key === "ArrowUp") dir = { x: 0, y: -1 };
			if (e.key === "ArrowDown") dir = { x: 0, y: 1 };
			if (e.key === "ArrowLeft") dir = { x: -1, y: 0 };
			if (e.key === "ArrowRight") dir = { x: 1, y: 0 };
		}

		window.addEventListener("keydown", onKey);
		draw();
		timer = window.setTimeout(step, speed);

		return () => {
			window.removeEventListener("keydown", onKey);
			clearTimeout(timer);
		};
	}, []);

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-medium">Snake Snack</h2>
				<div>
					<button onClick={() => window.location.reload()} className="px-3 py-1 bg-gray-200 rounded">
						Restart
					</button>
				</div>
			</div>
			<div className="overflow-auto">
				<canvas ref={canvasRef} className="border rounded" />
			</div>
			{!running && <div className="mt-3 text-red-600">Game over — press Restart</div>}
		</div>
	);
}

/* ----------------- Simple Space Invaders demo (very small) ----------------- */

function SpaceInvaders() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
		}

		function step() {
			// move enemies
			let leftMost = Math.min(...enemies.filter(e=>e.alive).map(e=>e.x)) || 0;
			let rightMost = Math.max(...enemies.filter(e=>e.alive).map(e=>e.x)) || w;
			if (rightMost > w - 20 || leftMost < 20) dir *= -1;
			enemies.forEach((e) => (e.x += dir * 4));
			bullets.forEach((b) => (b.y -= 6));
			bullets = bullets.filter((b) => b.y > 0);
			// collisions
			bullets.forEach((b) => {
				enemies.forEach((e) => {
					if (!e.alive) return;
					if (b.x > e.x - 12 && b.x < e.x + 12 && b.y > e.y - 8 && b.y < e.y + 8) {
						e.alive = false;
						b.y = -1000;
					}
				});
			});
			draw();
			if (anim) requestAnimationFrame(step);
		}

		function onKey(e: KeyboardEvent) {
			if (e.key === "ArrowLeft") player.x -= 10;
			if (e.key === "ArrowRight") player.x += 10;
			if (e.key === " ") bullets.push({ x: player.x + player.w / 2, y: player.y });
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

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-medium">Space Invaders Jr.</h2>
				<div className="text-sm text-gray-600">Use ← → and Space to shoot</div>
			</div>
			<div className="overflow-auto">
				<canvas ref={canvasRef} className="border rounded w-full max-w-[480px]" />
			</div>
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

