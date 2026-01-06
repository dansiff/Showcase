import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Walking with Christ: A New Way to Learn Biblical Teachings Through Gaming',
  description: 'Discover how an innovative educational game is bringing Jesus\' parables and teachings to life for modern learners.',
};

export default function WalkingWithChristPost() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8 transition-colors"
      >
        ← Back to Blog
      </Link>

      <article className="prose prose-invert prose-indigo max-w-none">
        <header className="mb-8 border-b border-gray-800 pb-8">
          <div className="mb-4 flex items-center gap-3 text-sm">
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
              Game Development
            </span>
            <span className="text-gray-500">December 29, 2025</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">5 min read</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Walking with Christ: A New Way to Learn Biblical Teachings Through Gaming
          </h1>

          <p className="text-xl text-gray-400">
            Discover how an innovative educational game is bringing Jesus' parables and teachings to life for modern learners through interactive storytelling and gameplay.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold">
              DS
            </div>
            <div>
              <div className="font-medium">Dan Sandoval</div>
              <div className="text-sm text-gray-500">Developer & Creator</div>
            </div>
          </div>
        </header>

        <div className="space-y-6 text-gray-300">
          <div className="my-8 text-center text-6xl">🕊️✨📖</div>

          <h2 className="text-2xl font-bold text-white mt-8">A Fresh Approach to Biblical Education</h2>
          
          <p>
            In an age where digital experiences shape how we learn and engage with the world, a new Christian educational game is revolutionizing how people—especially younger generations—encounter the timeless teachings of Jesus Christ. "Walking with Christ" isn't just another religious app; it's an immersive, interactive journey through the most powerful stories ever told.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">Bringing Parables to Life</h2>
          
          <p>
            The game centers on Jesus' parables—those profound, story-based teachings that have guided believers for two millennia. Each parable becomes an interactive experience where players don't just read about concepts like forgiveness, mercy, and faith—they actively participate in scenarios that embody these principles.
          </p>

          <div className="my-8 rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-6">
            <h3 className="text-xl font-semibold text-indigo-300 mb-3">Featured Parables</h3>
            <ul className="space-y-2 text-gray-300">
              <li>🌱 <strong>The Parable of the Sower</strong> - Make choices about where to plant seeds and watch how different environments affect growth</li>
              <li>🐑 <strong>The Good Shepherd</strong> - Navigate challenges while protecting and guiding your flock</li>
              <li>💰 <strong>The Lost Coin</strong> - Experience the joy of finding what was lost and the value of perseverance</li>
              <li>🏠 <strong>The Prodigal Son</strong> - Journey through decisions, consequences, and redemption</li>
              <li>👥 <strong>The Good Samaritan</strong> - Choose how to respond to those in need along your path</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8">Interactive Biblical Lessons</h2>
          
          <p>
            Beyond parables, the game incorporates key moments from Jesus' ministry, allowing players to witness and participate in:
          </p>

          <ul className="space-y-2 ml-6">
            <li>🍞 <strong>The Feeding of the Five Thousand</strong> - Learn about faith, generosity, and miracles</li>
            <li>⛵ <strong>Calming the Storm</strong> - Experience trust in the midst of life's chaos</li>
            <li>💡 <strong>The Sermon on the Mount</strong> - Discover the Beatitudes through interactive scenarios</li>
            <li>🌊 <strong>Walking on Water</strong> - Understand the relationship between faith and fear</li>
            <li>🙏 <strong>The Lord's Prayer</strong> - Learn each line through meaningful mini-experiences</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">Designed for All Ages</h2>
          
          <p>
            While the game is perfectly suited for children and teens—with colorful visuals, engaging gameplay, and age-appropriate content—it offers depth that appeals to adults as well. The multi-layered storytelling ensures that:
          </p>

          <ul className="space-y-2 ml-6">
            <li>✨ <strong>Children</strong> enjoy fun, safe gameplay with simple moral lessons</li>
            <li>📚 <strong>Teens</strong> engage with deeper theological concepts and character development</li>
            <li>🎯 <strong>Adults</strong> appreciate the nuanced storytelling and opportunities for reflection</li>
            <li>👨‍👩‍👧‍👦 <strong>Families</strong> can play together and discuss faith in meaningful ways</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">Educational Features</h2>
          
          <div className="my-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-gray-800/50 p-5 border border-gray-700">
              <div className="text-3xl mb-2">📖</div>
              <h3 className="font-semibold text-indigo-300 mb-2">Scripture Integration</h3>
              <p className="text-sm text-gray-400">
                Direct Bible verses appear contextually, teaching players to connect stories with scripture
              </p>
            </div>

            <div className="rounded-xl bg-gray-800/50 p-5 border border-gray-700">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="font-semibold text-indigo-300 mb-2">Choice-Based Learning</h3>
              <p className="text-sm text-gray-400">
                Players make moral decisions and see the outcomes, reinforcing biblical principles
              </p>
            </div>

            <div className="rounded-xl bg-gray-800/50 p-5 border border-gray-700">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-semibold text-indigo-300 mb-2">Progress Tracking</h3>
              <p className="text-sm text-gray-400">
                Unlock new parables, collect wisdom badges, and review lessons learned
              </p>
            </div>

            <div className="rounded-xl bg-gray-800/50 p-5 border border-gray-700">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold text-indigo-300 mb-2">Reflection Prompts</h3>
              <p className="text-sm text-gray-400">
                Thoughtful questions encourage players to apply teachings to their own lives
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8">A Safe, Ad-Free Environment</h2>
          
          <p>
            Parents and educators can rest easy knowing the game provides a completely safe environment:
          </p>

          <ul className="space-y-2 ml-6">
            <li>✅ No advertisements or in-app purchases</li>
            <li>✅ Age-appropriate content vetted by Christian educators</li>
            <li>✅ Privacy-focused with no data collection</li>
            <li>✅ Offline play available for anywhere, anytime access</li>
            <li>✅ Parental controls and progress monitoring</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">More Than Entertainment</h2>
          
          <p>
            "Walking with Christ" represents a new frontier in faith-based education. By meeting learners where they are—in the digital spaces they already inhabit—the game creates opportunities for genuine spiritual growth and biblical literacy.
          </p>

          <p>
            Teachers can use it as a Sunday School supplement. Parents can play alongside their children, opening doors for meaningful conversations about faith. Youth groups can explore levels together, discussing the choices and their outcomes.
          </p>

          <div className="my-8 rounded-2xl bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-500/30 p-6">
            <h3 className="text-xl font-semibold text-green-300 mb-3">💡 Developer's Vision</h3>
            <p className="text-gray-300 italic">
              "We wanted to create something that honors the depth and beauty of Christ's teachings while making them accessible to a generation that learns through interaction. Every choice, every level, every animation is designed with one goal: to help people encounter Jesus in a fresh, memorable way."
            </p>
            <p className="text-sm text-gray-400 mt-3">— Development Team</p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8">Looking Ahead</h2>
          
          <p>
            As the game continues to evolve, the development team plans to add:
          </p>

          <ul className="space-y-2 ml-6">
            <li>🌍 Stories from the Old Testament</li>
            <li>🎵 Original worship music and hymns</li>
            <li>🌐 Multi-language support for global reach</li>
            <li>👥 Multiplayer co-op modes for group play</li>
            <li>📱 Mobile and tablet versions</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">Conclusion: Gaming with Purpose</h2>
          
          <p>
            In a world where screen time is inevitable, "Walking with Christ" offers something truly valuable: screen time with eternal purpose. It proves that games can be powerful tools for teaching, reflection, and spiritual formation—all while being genuinely fun to play.
          </p>

          <p>
            Whether you're a parent seeking quality Christian content for your children, a teacher looking for engaging educational tools, or simply someone who wants to deepen their understanding of Jesus' teachings, this game offers a unique and powerful way to walk alongside Christ through His most memorable lessons.
          </p>

          <div className="my-8 text-center">
            <p className="text-xl font-semibold text-indigo-300">
              "Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these."
            </p>
            <p className="text-sm text-gray-500 mt-2">— Matthew 19:14</p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">About This Project</h3>
            <p className="text-gray-400">
              This blog post explores a concept for an innovative Christian educational game. If you're interested in collaborating, providing feedback, or learning more about faith-based game development, we'd love to hear from you.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Back to all posts
          </Link>
        </div>
      </article>
    </main>
  );
}
