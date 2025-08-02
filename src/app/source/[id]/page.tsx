import { getArticlesBySourceId, getSourceById } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default async function SourceArticlesPage({ params }: { params: { id: string } }) {
  const source = await getSourceById(params.id)
  if (!source) {
    notFound()
  }

  const articles = await getArticlesBySourceId(params.id)

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        <div>
            <Button asChild variant="ghost" className="mb-4">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    All Sources
                </Link>
            </Button>
            <h1 className="text-3xl font-bold font-headline tracking-tight">{source.name}</h1>
            <p className="text-muted-foreground">Articles available from this source.</p>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">
                    <Link href={`/article/${article.id}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <BookOpen className="mr-1.5 h-4 w-4" />
                        <span>{article.content.length} paragraphs</span>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No articles found for this source.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
