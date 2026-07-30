import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Account | Animated Bible TV",
  description:
    "Request deletion of your Animated Bible TV account and associated personal data.",
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <header className="bg-blue-700 px-6 py-10 text-center text-white">
          <h1 className="text-3xl font-bold md:text-4xl">
            Delete Your Animated Bible TV Account
          </h1>

          <p className="mt-3 text-blue-100">
            Request the permanent deletion of your account and associated data.
          </p>
        </header>

        <section className="space-y-8 px-6 py-10 md:px-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              About this page
            </h2>

            <p className="mt-3 leading-7 text-gray-700">
              Animated Bible TV is operated by Janet Bambi Studio. This page
              allows users of the Animated Bible TV mobile application to
              request deletion of their account and the personal data connected
              to it.
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h2 className="text-xl font-bold text-gray-900">
              How to request account deletion
            </h2>

            <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-gray-700">
              <li>
                Enter the name and email address associated with your Animated
                Bible TV account in the form below.
              </li>

              <li>
                Select <strong>Delete my account and associated data</strong>.
              </li>

              <li>
                Submit the form.
              </li>

              <li>
                We may contact you through the submitted email address to verify
                that you own the account.
              </li>

              <li>
                After verification, your deletion request will normally be
                completed within seven working days.
              </li>
            </ol>
          </div>

          <form
            action="https://formspree.io/f/xaqvkdoq"
            method="POST"
            className="space-y-5 rounded-xl border border-gray-200 p-6"
          >
            <input
              type="hidden"
              name="_subject"
              value="Animated Bible TV Account Deletion Request"
            />

            <input
              type="hidden"
              name="application"
              value="Animated Bible TV"
            />

            <div>
              <label
                htmlFor="name"
                className="mb-2 block font-semibold text-gray-800"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-semibold text-gray-800"
              >
                Email used for your Animated Bible TV account
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your account email"
              />
            </div>

            <div>
              <label
                htmlFor="requestType"
                className="mb-2 block font-semibold text-gray-800"
              >
                Request type
              </label>

              <select
                id="requestType"
                name="request_type"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a request
                </option>

                <option value="Delete my account and associated data">
                  Delete my account and associated data
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block font-semibold text-gray-800"
              >
                Additional information
              </label>

              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="Provide any additional information that can help us identify your account."
              />
            </div>

            <label className="flex items-start gap-3 text-sm leading-6 text-gray-700">
              <input
                type="checkbox"
                name="confirmation"
                value="I confirm that I want my account permanently deleted"
                required
                className="mt-1 h-5 w-5"
              />

              <span>
                I confirm that I am requesting the permanent deletion of my
                Animated Bible TV account and associated data. I understand that
                this action cannot be reversed after deletion is completed.
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Submit Account Deletion Request
            </button>
          </form>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Data that will be deleted
            </h2>

            <p className="mt-3 leading-7 text-gray-700">
              After the account owner has been verified, the following
              account-associated information will be deleted where applicable:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-gray-700">
              <li>Firebase authentication account</li>
              <li>Name and email address connected to the app account</li>
              <li>Cloud-saved favourites</li>
              <li>Continue Watching history</li>
              <li>Continue Reading history</li>
              <li>Other data linked directly to the user account</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Data that may be retained
            </h2>

            <p className="mt-3 leading-7 text-gray-700">
              Limited information may be retained where required for security,
              fraud prevention, legal compliance or regulatory obligations.
              Any retained information will not be used for advertising or
              ordinary app personalization and will be deleted when the
              applicable retention requirement ends.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Processing period
            </h2>

            <p className="mt-3 leading-7 text-gray-700">
              Account deletion requests are normally processed within seven
              working days after ownership of the account has been verified.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Guest users
            </h2>

            <p className="mt-3 leading-7 text-gray-700">
              Users who access Animated Bible TV through Guest Mode may not have
              an online account. Guest activity stored only on the device can
              normally be removed by clearing the app data or uninstalling the
              application.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
            <p>
              Animated Bible TV is developed and operated by Janet Bambi
              Studio.
            </p>

            <p className="mt-2">
              This account-deletion page applies to the Animated Bible TV
              Android application.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}