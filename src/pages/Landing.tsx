import { useNavigate, Link } from "react-router-dom"
import { GITHUB_URL } from "../constants/landing"

export const Landing = (): JSX.Element => {
  const navigate = useNavigate()

  const handleGetStarted = (): void => {
    navigate("/workspace")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-800 to-dark-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl transform rotate-12" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl transform -rotate-12" />
      </div>

      <div className="container max-w-4xl mx-auto px-4 relative">
        <section className="flex flex-col items-center justify-center text-center space-y-8 animate-fade-in py-8">
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto relative group">
              <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-md transition-all group-hover:bg-primary/15 group-hover:blur-lg" />
              <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-1 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/icon-maskable.png" 
                  alt="SnowPalette Logo" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-500">
                SnowPalette
              </h1>
              <p className="text-lg text-gray-300 max-w-xl mx-auto animate-slide-up leading-relaxed">
                Organize, share, and manage your color palettes with ease.
                <span className="block mt-2 text-sm text-gray-400">Perfect for designers and developers.</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 animate-slide-up pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button 
                onClick={handleGetStarted}
                className="px-6 py-2.5 bg-dark-700/50 text-white rounded-lg font-medium transition-all border border-dark-600 hover:bg-dark-600/50 hover:border-primary/50 backdrop-blur-sm focus:ring-2 focus:ring-primary-300 focus:outline-none text-sm min-w-[120px]"
                aria-label="Get started with SnowPalette"
              >
                Get Started
              </button>
              <Link 
                to="/docs"
                className="px-6 py-2.5 bg-primary hover:bg-primary-600 text-white rounded-lg font-medium transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 focus:ring-2 focus:ring-primary-300 focus:outline-none text-sm group min-w-[120px]"
                aria-label="View documentation"
              >
                Documentation
                <span className="inline-block ml-1 transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>

            <div className="w-full max-w-[280px] flex items-center gap-3 opacity-80">
              <div className="h-px bg-gradient-to-r from-transparent via-dark-600 to-transparent flex-grow" />
              <span className="text-xs text-gray-400 px-2 py-0.5 bg-dark-700/50 rounded-full border border-dark-600">
                v1.0.0
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-dark-600 to-transparent flex-grow" />
            </div>

            <a 
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-gray-400 hover:text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-primary-300 focus:outline-none inline-flex items-center gap-2 hover:bg-dark-700/30 text-sm"
              aria-label="View source code on GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
          </div>
        </section>
      </div>
    </main>
  )
} 

export default Landing 