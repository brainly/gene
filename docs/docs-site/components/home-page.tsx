import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Star, GitFork, Users } from 'lucide-react';

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-20 lg:py-24 xl:py-30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-barlow font-black tracking-normal sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Brainly Gene
                </h1>
                <p className="font-barlow font-black mx-auto max-w-[700px] text-gray-500 md:text-4xl dark:text-gray-400">
                  <span className="dark:text-text1">Generate,</span>{' '}
                  <span className="dark:text-text2">Develop,</span>{' '}
                  <span className="dark:text-text3">Make a difference</span>
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <a href="/gene#get-started">Get Started</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://github.com/brainly/gene">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-20 lg:py-24 xl:py-30 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-black tracking-normal sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle className="font-barlow font-black text-text1">
                    Code Organization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Bring well-defined structure to your codebase for better team
                  collaboration.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-barlow font-black text-text2">
                    Standards & patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Opinionated React architecture designed for scale.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-barlow font-black text-text3">
                    Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Keep your codebase clean and maintainable with automated
                  checks, ESLint plugins and more.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="community"
          className="w-full py-12 md:py-20 lg:py-24 xl:py-30"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-black tracking-normal sm:text-5xl text-center mb-12">
              Join Our Community
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <a href="https://github.com/brainly/gene">
                    <CardTitle className="flex items-center">
                      <Star className="mr-2 h-4 w-4" />
                      <span className="font-barlow font-black text-text1">
                        Star
                      </span>
                    </CardTitle>
                  </a>
                </CardHeader>
                <CardContent>
                  Show your support by starring our GitHub repository.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <a href="https://github.com/brainly/gene/fork">
                    <CardTitle className="flex items-center">
                      <GitFork className="mr-2 h-4 w-4" />
                      <span className="font-barlow font-black text-text2">
                        Contribute
                      </span>
                    </CardTitle>
                  </a>
                </CardHeader>
                <CardContent>
                  Fork the repo and submit pull requests to help improve Brainly
                  Gene 🧬.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <a href="https://github.com/brainly/gene/discussions">
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span className="font-barlow font-black text-text3">
                        Discuss
                      </span>
                    </CardTitle>
                  </a>
                </CardHeader>
                <CardContent>
                  Join our community forums to ask questions and share ideas.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
