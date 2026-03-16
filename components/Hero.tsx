import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            AI marketing for real businesses
          </p>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
            Create marketing campaigns and promo posters in seconds
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Marketa AI helps small businesses generate social media captions,
            WhatsApp promos, ad copy, marketing tips, daily post ideas, and
            ready-to-post promotional posters from one simple prompt.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-xl bg-slate-900 px-6 py-3 text-center font-medium text-white hover:bg-slate-700"
            >
              Start Free
            </Link>

            <a
              href="#example-output"
              className="rounded-xl border border-slate-300 px-6 py-3 text-center font-medium text-slate-800 hover:bg-slate-50"
            >
              See Example
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-2">
              Social captions
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-2">
              WhatsApp promos
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-2">
              Ad copy
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-2">
              Daily ideas
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-2">
              Promo posters
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm font-medium text-slate-500">
            Example campaign request
          </p>

          <div className="rounded-xl bg-slate-50 p-4 text-slate-800">
            Business Type: Restaurant / Food Business
            <br />
            Promotion: Promote my weekend burger special and free drink combo.
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold">Instagram / Facebook Caption</h3>
              <p className="mt-2 text-sm text-slate-600">
                Weekend burger deal is here 🍔 Grab our special combo with a
                FREE drink and treat yourself this weekend. Bring your friends
                and visit us today.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold">Daily Idea</h3>
              <p className="mt-2 text-sm text-slate-600">
                Post a short behind-the-scenes burger preparation video and add
                a limited-time weekend call to action.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold">Poster Generation</h3>
              <p className="mt-2 text-sm text-slate-600">
                Turn the campaign into a ready-to-post social media promo poster
                in one click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}