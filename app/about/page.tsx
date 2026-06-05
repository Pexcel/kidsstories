export default function AboutPage() {
  return (
    <main className="min-h-screen bg-yellow-50 px-4 py-16">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-md border p-8 md:p-12">
        <h1 className="text-4xl font-bold text-orange-600">
          About KidsStories
        </h1>

        <p className="mt-6 text-slate-700 leading-relaxed">
          KidsStories is a children’s Bible learning platform produced by
          JanetBambiStudio. It was created to help children learn Bible stories
          through animations, Bible readings, memory verses, simple lessons, and
          prayers.
        </p>

        <p className="mt-4 text-slate-700 leading-relaxed">
          Our goal is to provide safe, joyful, and faith-building content for
          children, parents, churches, and schools.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">
          What We Offer
        </h2>

        <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-700">
          <li>Bible chapter animations for children</li>
          <li>Simple Bible readings and summaries</li>
          <li>Children’s lessons from each Bible chapter</li>
          <li>Memory verses and short prayers</li>
          <li>Safe Christian video content for families</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8">
          Produced By
        </h2>

        <p className="mt-4 text-slate-700 leading-relaxed">
          KidsStories is produced by JanetBambiStudio.
        </p>
      </div>
    </main>
  );
}