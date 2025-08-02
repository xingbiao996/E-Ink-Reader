"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { getArticleById } from '@/lib/data'
import { notFound, useRouter } from 'next/navigation'
import type { Article } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home, BookOpen } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [pages, setPages] = useState<string[][]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const calculatePages = useCallback(() => {
    if (!article || !pageRef.current) return;

    const pageHeight = pageRef.current.clientHeight;
    const newPages: string[][] = [];
    let currentLineItems: string[] = [];
    
    const tempContainer = document.createElement('div');
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.position = 'absolute';
    tempContainer.style.width = `${pageRef.current.clientWidth}px`;
    tempContainer.className = 'prose prose-lg dark:prose-invert max-w-none space-y-4 text-justify';
    tempContainer.style.fontSize = '1.1rem';
    tempContainer.style.lineHeight = '1.7';
    document.body.appendChild(tempContainer);
    
    let currentHeight = 0;

    article.content.forEach(p => {
        const pElement = document.createElement('p');
        pElement.textContent = p;
        tempContainer.appendChild(pElement);
        const pHeight = pElement.offsetHeight;

        if(currentHeight + pHeight > pageHeight && currentLineItems.length > 0) {
            newPages.push(currentLineItems);
            currentLineItems = [];
            currentHeight = 0;
        }
        
        currentLineItems.push(p);
        currentHeight += pHeight;
        tempContainer.removeChild(pElement);
    });

    if (currentLineItems.length > 0) {
        newPages.push(currentLineItems);
    }
    
    document.body.removeChild(tempContainer);
    
    setPages(newPages)
    
    const targetParagraphIndex = article.currentParagraph || 0
    const targetPage = newPages.findIndex(pageContent => 
        pageContent.includes(article.content[targetParagraphIndex])
    )
    setCurrentPage(targetPage >= 0 ? targetPage : 0);
    
  }, [article])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const fetchedArticle = await getArticleById(params.id)
      if (!fetchedArticle) {
        notFound()
      }
      setArticle(fetchedArticle)
      setProgress(fetchedArticle.readPercentage)
      setIsLoading(false)
    }
    fetchData()
  }, [params.id])

  useEffect(() => {
    if (!isLoading && article) {
      calculatePages()
    }
    window.addEventListener('resize', calculatePages)
    return () => window.removeEventListener('resize', calculatePages)
  }, [isLoading, article, calculatePages])

  useEffect(() => {
    if (pages.length > 0) {
        const newProgress = Math.round(((currentPage + 1) / pages.length) * 100);
        setProgress(newProgress);
        
        if (article && pages[currentPage]) {
            const firstParagraphOfPage = pages[currentPage][0];
            const paragraphIndex = article.content.indexOf(firstParagraphOfPage);
            console.log(`模拟保存阅读进度：第 ${paragraphIndex} 段`);
        }
    }
  }, [currentPage, pages, article]);


  if (isLoading) {
    return <div className="container mx-auto max-w-3xl p-4 flex justify-center items-center h-screen">加载中...</div>
  }

  if (!article) {
    return notFound()
  }

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === pages.length - 1

  return (
    <div className="container mx-auto max-w-3xl p-4 h-screen flex flex-col">
        <header className="py-4 border-b mb-4 flex-shrink-0">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 overflow-hidden">
                    <BookOpen className="w-5 h-5 text-muted-foreground shrink-0" />
                    <h1 className="text-xl font-headline font-semibold truncate" title={article.title}>
                        {article.title}
                    </h1>
                </div>
                 <div className="flex items-center">
                   <Progress value={progress} className="h-1.5 w-32" />
                   <span className="text-xs font-medium text-muted-foreground ml-3 whitespace-nowrap">
                     {pages.length > 0 ? `第 ${currentPage + 1} / ${pages.length} 页` : `0%`}
                   </span>
                </div>
            </div>
        </header>

        <main ref={pageRef} className="flex-grow overflow-hidden">
             {pages.length > 0 ? (
                <div ref={contentRef} className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-justify h-full" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                    {pages[currentPage]?.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-full">正在计算分页...</div>
            )}
        </main>
        
        <footer className="py-4 border-t mt-4 flex-shrink-0">
            <div className="flex items-center justify-between">
                <Button onClick={handlePrevPage} variant="outline" disabled={isFirstPage} className={isFirstPage ? "pointer-events-none opacity-50" : ""}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    上一页
                </Button>
                
                <Button onClick={() => router.push('/')} variant="ghost">
                    <Home className="mr-2 h-4 w-4" />
                    返回书架
                </Button>

                <Button onClick={handleNextPage} variant="outline" disabled={isLastPage} className={isLastPage ? "pointer-events-none opacity-50" : ""}>
                    下一页
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </footer>
    </div>
  )
}
