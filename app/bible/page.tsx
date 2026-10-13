import Navigation from '@/components/speechtherapy/Navigation';
import Footer from '@/components/speechtherapy/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bible Insights - New Testament Study Guide',
  description: 'Explore the New Testament with popular insights, key verses, and study guides. Deepen your faith with curated biblical wisdom.',
  keywords: 'bible, new testament, scripture, biblical insights, faith, Christian, Jesus, spiritual growth',
};

const books = [
  {
    name: 'Gospels',
    books: [
      { title: 'Matthew', description: 'The life and teachings of Jesus Christ', keyVerse: 'Matthew 5:16' },
      { title: 'Mark', description: 'Jesus as the suffering Servant', keyVerse: 'Mark 10:45' },
      { title: 'Luke', description: 'Jesus as the Son of Man', keyVerse: 'Luke 19:10' },
      { title: 'John', description: 'Jesus as the Son of God', keyVerse: 'John 3:16' },
    ],
  },
  {
    name: 'Acts & Epistles',
    books: [
      { title: 'Acts', description: 'The early church and Holy Spirit', keyVerse: 'Acts 1:8' },
      { title: 'Romans', description: 'Salvation by faith through grace', keyVerse: 'Romans 8:28' },
      { title: '1 Corinthians', description: 'Love, unity, and spiritual gifts', keyVerse: '1 Corinthians 13:13' },
      { title: 'Ephesians', description: 'Unity in Christ and spiritual warfare', keyVerse: 'Ephesians 6:10' },
      { title: 'Philippians', description: 'Joy in Christ regardless of circumstances', keyVerse: 'Philippians 4:13' },
      { title: 'Hebrews', description: 'Christ as the perfect High Priest', keyVerse: 'Hebrews 11:1' },
    ],
  },
  {
    name: 'Pastoral & Prophetic',
    books: [
      { title: '1 & 2 Timothy', description: 'Leadership and sound doctrine', keyVerse: '2 Timothy 3:16-17' },
      { title: 'James', description: 'Faith in action', keyVerse: 'James 2:17' },
      { title: '1 Peter', description: 'Living as exiles in a hostile world', keyVerse: '1 Peter 5:7' },
      { title: '1 John', description: 'Love and fellowship with God', keyVerse: '1 John 4:8' },
      { title: 'Revelation', description: 'Hope in Christ\'s return', keyVerse: 'Revelation 21:4' },
    ],
  },
];

const popularInsights = [
  {
    title: 'The Beatitudes',
    reference: 'Matthew 5:3-12',
    insight: 'Jesus teaches that true blessedness comes through humility, meekness, and persecution for righteousness. These counter-cultural values define the kingdom of God.',
  },
  {
    title: 'The Greatest Commandment',
    reference: 'Matthew 22:37-40',
    insight: 'Love for God and love for others summarize all the law and prophets. This dual command is the foundation of Christian ethics.',
  },
  {
    title: 'The Parable of the Sower',
    reference: 'Mark 4:13-20',
    insight: 'The condition of the heart determines how God\'s Word takes root. Four soil types represent different responses to the gospel.',
  },
  {
    title: 'The New Commandment',
    reference: 'John 13:34-35',
    insight: 'Jesus commands us to love one another as He loved us. This love becomes the identifying mark of His disciples.',
  },
  {
    title: 'Justification by Faith',
    reference: 'Romans 3:21-26',
    insight: 'Righteousness comes through faith in Christ alone, not by works. God declares sinners righteous through Christ\'s atoning sacrifice.',
  },
  {
    title: 'The Armor of God',
    reference: 'Ephesians 6:10-18',
    insight: 'Spiritual warfare requires divine equipment: truth, righteousness, gospel, faith, salvation, and Word of God.',
  },
  {
    title: 'The Love Chapter',
    reference: '1 Corinthians 13',
    insight: 'Without love, even the greatest spiritual gifts are meaningless. Love is the supreme virtue that never fails.',
  },
  {
    title: 'Faith That Works',
    reference: 'James 2:14-26',
    insight: 'Genuine faith produces works. Faith without works is dead — true faith demonstrates itself through action.',
  },
];

const dailyVerses = [
  'John 3:16 - For God so loved the world...',
  'Philippians 4:6 - Be anxious for nothing...',
  'Romans 8:28 - All things work together for good...',
  'Proverbs 3:5-6 - Trust in the Lord with all your heart...',
  'Psalm 23:1 - The Lord is my shepherd...',
  'Isaiah 40:31 - They who wait for the Lord...',
  '2 Timothy 3:16 - All Scripture is God-breathed...',
  'Hebrews 11:1 - Faith is the substance of things hoped for...',
];

export default function BiblePage() {
  return (
    <div className="bg-gradient-to-b from-amber-50 to-stone-100 min-h-screen">
      <Navigation />
      
      <main className="pt-20 pb-12">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-amber-800 to-amber-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center">
              <span className="inline-block text-amber-200 text-lg mb-4">📖</span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Bible Insights</h1>
              <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                Explore the New Testament with curated insights, key verses, and study guides for your spiritual journey.
              </p>
            </div>
          </div>
        </section>

        {/* Daily Verses */}
        <section className="max-w-4xl mx-auto px-4 -mt-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-200">
            <h2 className="text-2xl font-bold text-amber-900 mb-4 text-center">✨ Daily Verses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dailyVerses.map((verse, index) => (
                <div key={index} className="bg-amber-50 rounded-lg p-3 text-amber-800 text-sm hover:bg-amber-100 transition-colors cursor-pointer">
                  {verse}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Insights */}
        <section className="max-w-6xl mx-auto px-4 mt-12">
          <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">
            <span className="border-b-4 border-amber-500 pb-2">Popular Insights</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularInsights.map((insight, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-2">{insight.title}</h3>
                    <p className="text-amber-700 font-semibold mb-2">{insight.reference}</p>
                    <p className="text-stone-600 leading-relaxed">{insight.insight}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Books of the New Testament */}
        <section className="max-w-6xl mx-auto px-4 mt-16">
          <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">
            <span className="border-b-4 border-amber-500 pb-2">New Testament Books</span>
          </h2>
          <div className="space-y-8">
            {books.map((category, catIndex) => (
              <div key={catIndex} className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-amber-800 mb-6">{category.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.books.map((book, bookIndex) => (
                    <div key={bookIndex} className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200 hover:border-amber-400 transition-colors cursor-pointer">
                      <h4 className="text-lg font-bold text-stone-800 mb-2">{book.title}</h4>
                      <p className="text-stone-600 text-sm mb-3">{book.description}</p>
                      <p className="text-amber-700 text-xs font-semibold">📍 {book.keyVerse}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Study Resources */}
        <section className="max-w-4xl mx-auto px-4 mt-16">
          <div className="bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">📚 Study Resources</h2>
            <p className="text-stone-300 mb-6">
              Deepen your understanding of Scripture with these recommended study approaches.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">📝</div>
                <h4 className="font-semibold mb-1">Journaling</h4>
                <p className="text-sm text-stone-300">Write reflections on what you learn</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">👥</div>
                <h4 className="font-semibold mb-1">Group Study</h4>
                <p className="text-sm text-stone-300">Discuss with fellow believers</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold mb-1">Application</h4>
                <p className="text-sm text-stone-300">Apply lessons to daily life</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}