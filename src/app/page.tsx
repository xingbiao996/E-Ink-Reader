import Link from 'next/link'
import { getShelfBooks } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Library, BookOpen } from 'lucide-react'
import { AddSourceForm } from '@/components/AddSourceForm'
import { Progress } from '@/components/ui/progress'

export default async function BookshelfPage() {
  const shelfBooks = await getShelfBooks()

  return (
    <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="space-y-12">
        <Card className="bg-secondary/30 border-primary/20">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-3">
                    <Library className="w-8 h-8 text-primary" />
                    探索您的图书馆
                </CardTitle>
                <CardDescription>
                    发现来自所有来源的书籍，并将它们添加到您的个人书架中。
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/library">
                        前往图书馆 <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>

        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold font-headline tracking-tight">书架</h1>
                    <p className="text-muted-foreground">
                       您已选择的书籍，点击即可继续阅读。
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Button asChild variant="outline">
                        <Link href="/sources">
                            管理来源
                        </Link>
                    </Button>
                </div>
            </div>

          {shelfBooks.length === 0 ? (
            <Card className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">您的书架是空的。请先从图书馆添加书籍。</p>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {shelfBooks.map((book) => (
                <Card key={book.id} className="flex flex-col group">
                    <CardHeader className="p-4 flex-1">
                        <Link href={`/article/${book.id}`}>
                            <CardTitle className="font-headline text-lg mb-2 group-hover:underline">{book.title}</CardTitle>
                        </Link>
                        <CardDescription className="text-xs flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" /> {book.sourceName}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <Progress value={book.readPercentage} className="h-2 mb-2" />
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>已读 {book.readPercentage}%</p>
                            <p className="truncate">当前阅读：{book.currentChapter}</p>
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
