import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About East Africa Classifieds</h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            Connecting global enterprises and professionals with companies in East Africa
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-16">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl">
            East Africa Classifieds (EAC) is a dynamic, inclusive business platform dedicated to connecting global enterprises and professionals with companies in East Africa. EAC connects entrepreneurs, investors, business leaders, professionals and institutions through strategic partnerships, innovative programs, and high-impact networking opportunities. Our goal is to unlock the immense potential of Africa's private sector by fostering sustainable development, boosting intra-African trade, and championing inclusive economic growth.
          </p>
        </section>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Our Vision</h2>
            <p className="text-gray-700 dark:text-gray-300">
              To be East Africa's most trusted and transformative business platform—empowering, connecting, and accelerating enterprise growth to achieve shared prosperity across the continent.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-zinc-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300">
              To unite, engage, connect, and promote businesses by offering collaborative opportunities, access to critical resources, market expansion strategies, capacity-building programs, and effective policy advocacy. EAC is dedicated to cultivating entrepreneurship and innovation across Uganda, East Africa, and the wider African continent.
            </p>
          </div>
        </div>

        {/* Core Objectives */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">Core Objectives</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">Business Unity & Engagement</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Foster a collaborative business environment by bringing together enterprises of all sectors and sizes onto a shared platform that encourages partnership, dialogue, and mutual growth.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">Networking & Strategic Connections</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Create meaningful connections among entrepreneurs, investors, policymakers, development partners, and institutions at local, regional, and continental levels to drive impactful collaborations.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">Brand Promotion & Business Visibility</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Enhance the visibility and brand strength of African businesses through comprehensive media exposure, high-profile events, exhibitions, and robust digital platforms.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">Entrepreneurship & Innovation Development</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Build a resilient entrepreneurial ecosystem by providing mentorship, training, incubation, and support programs tailored for startups and SMEs.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">Access to Markets & Finance</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Bridge the gap between businesses and market opportunities by facilitating access to finance, investment networks, and trade linkages—empowering enterprises to scale and succeed.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 bg-blue-50 dark:bg-zinc-900 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4">Join Our Community</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            East Africa Classifieds – Connecting East Africa with you
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
} 