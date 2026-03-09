import Link from "next/link";

export default function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-3xl bg-slate-900 px-8 py-16 text-center text-white">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to market your business faster?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Stop struggling with captions and promotions. Let Marketa AI generate
          your next campaign in seconds.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-medium text-slate-900 hover:bg-slate-100"
        >
          Start Free
        </Link>
      </div>
    </section>
  );
}