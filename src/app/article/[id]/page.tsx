import { getArticleById } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const PARAGRAPHS_PER_PAGE = 5;

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { page?: string }
}) {
  const article = await getArticleById(params.id)
  if (!article) {
    notFound()
  }

  const currentPage = Number(searchParams.page) || 1
  const totalPages = Math.ceil(article.content.length / PARAGRAPHS_PER_PAGE)
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const contentForPage = article.content.slice(
    (currentPage - 1) * PARAGRAPHS_PER_PAGE,
    currentPage * PARAGRAPHS_PER_PAGE
  )

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
            <Button asChild variant="ghost" className="-ml-4">
                <Link href={`/library`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    返回图书馆
                </Link>
            </Button>
        </div>

        <article className="space-y-6">
            <header>
                <h1 className="text-4xl font-bold font-headline leading-tight tracking-tight">{article.title}</h1>
            </header>
            
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-justify" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                {contentForPage.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </article>

        {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t pt-6">
                <Button asChild variant="outline" disabled={isFirstPage}>
                    <Link href={`/article/${article.id}?page=${currentPage - 1}`}
                          aria-disabled={isFirstPage}
                          tabIndex={isFirstPage ? -1 : undefined}
                          className={cn(isFirstPage && "pointer-events-none opacity-50")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        上一页
                    </Link>
                </Button>
                
                <span className="text-sm font-medium text-muted-foreground">
                    第 {currentPage} 页 / 共 {totalPages} 页
                </span>

                <Button asChild variant="outline" disabled={isLastPage}>
                    <Link href={`/article/${article.id}?page=${currentPage + 1}`}
                          aria-disabled={isLastPage}
                          tabIndex={isLastPage ? -1 : undefined}
                          className={cn(isLastPage && "pointer-events-none opacity-50")}>
                        下一页
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        )}
    </div>
  )
}
