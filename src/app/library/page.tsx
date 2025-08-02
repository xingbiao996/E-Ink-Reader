import { getAllArticles } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Library } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default async function LibraryPage() {
  const articles = await getAllArticles()

  if (!articles) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <Library className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline tracking-tight">图书馆</h1>
            </div>
            <p className="text-muted-foreground">来自您所有来源的全部书籍。</p>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Dialog key={article.id}>
                <Card className="flex items-center justify-between p-4">
                    <div className="flex-1 overflow-hidden">
                        <CardHeader className="p-0">
                            <CardTitle className="font-headline text-xl truncate">
                                {article.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <BookOpen className="mr-1.5 h-4 w-4" />
                                <span>{article.sourceName}</span>
                            </div>
                        </CardContent>
                    </div>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="ml-4 shrink-0">
                        查看详情
                      </Button>
                    </DialogTrigger>
                </Card>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{article.title}</DialogTitle>
                    <DialogDescription>
                      来源: {article.sourceName}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                      {article.content[0].substring(0, 200)}...
                    </p>
                  </div>
                   <Button asChild className="mt-4 w-full">
                       <Link href={`/article/${article.id}`}>开始阅读</Link>
                    </Button>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <Card className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">图书馆中没有书籍。请先添加来源。</p>
          </Card>
        )}
      </div>
    </div>
  )
}
