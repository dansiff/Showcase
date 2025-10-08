"use client";

import React, { useMemo, useState, useEffect } from "react";

type GameKey = "tictactoe" | "memory" | "embed";

export default function Page() {
	const [active, setActive] = useState<GameKey | null>(null);

	return (
		<div className="max-w-4xl mx-auto p-6">
			<header className="mb-6">
				<h1 className="text-3xl font-bold">Games Showcase</h1>
				<p className="text-sm text-gray-600 mt-2">
					Pick a game to load. Each demo is small and self-contained so you can
					copy it into your portfolio to showcase front-end skills: React
					interactivity, canvas, game logic, performance, accessibility and
					integration with external game engines.
				</p>
			</header>

			<section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<GameCard
					title="Tic Tac Toe"
					description="Classic X/O — shows React state, game logic and win detection."
					onOpen={() => setActive("tictactoe")}
				/>
				<GameCard
					title="Memory Match"
					description="Simple card-matching — demonstrates state, shuffle, and UX."
					onOpen={() => setActive("memory")}
				/>
				<GameCard
					title="Embed (itch.io / Unity)"
					description="Embed an external build (iframe) — shows integration / hosting."
					onOpen={() => setActive("embed")}
				/>
			</section>

			<main className="bg-white rounded-lg p-6 shadow-sm">
				{!active && (
					<div className="text-center text-gray-500">Select a game to try it.</div>
				)}

				{active === "tictactoe" && <TicTacToe />}
				{active === "memory" && <MemoryMatch />}
				{active === "embed" && <EmbedGame />}
			</main>
		</div>
	);
}

function GameCard({
	title,
	description,
	onOpen,
}: {
	title: string;
	description: string;
	onOpen: () => void;
}) {
	return (
		<div className="border rounded-lg p-4 flex flex-col justify-between">
			<div>
				<h3 className="font-semibold">{title}</h3>
				<p className="text-sm text-gray-600 mt-1">{description}</p>
			</div>
			<div className="mt-4">
				<button
					onClick={onOpen}
					className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
				>
					Open
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

export const GameNotes = () => (
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

