import Link from 'next/link'
import { getSources } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Book, Trash2 } from 'lucide-react'
import { AddSourceForm } from '@/components/AddSourceForm'
import { deleteSourceAction } from '@/app/actions'

export default async function SourceManagementPage() {
  const sources = await getSources()

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline tracking-tight">Reading Sources</h1>
          <p className="text-muted-foreground">
            Manage your imported web page reading sources.
          </p>
        </div>

        <AddSourceForm />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-headline">Your Sources</h2>
          {sources.length === 0 ? (
            <Card className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">You haven't added any sources yet.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {sources.map((source) => (
                <Card key={source.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <CardTitle className="font-headline">{source.name}</CardTitle>
                      <CardDescription className="line-clamp-1">{source.url}</CardDescription>
                    </div>
                     <form action={deleteSourceAction.bind(null, source.id)}>
                        <Button variant="ghost" size="icon" className="shrink-0" aria-label="Delete source">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </form>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-end">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <Book className="mr-1.5 h-4 w-4" />
                            <span>{source.articleCount} articles</span>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                            <Link href={`/source/${source.id}`}>
                                View Articles <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
