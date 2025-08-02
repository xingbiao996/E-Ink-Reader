
"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { getArticleById } from '@/lib/data'
import { notFound, useRouter } from 'next/navigation'
import type { Article } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [pages, setPages] = useState<string[][]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  const contentRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const calculatePages = useCallback(() => {
    if (!article || !pageRef.current || pageRef.current.clientHeight === 0) return;

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

    // Add title to temp container for height calculation on first page
    const titleElement = document.createElement('h1');
    titleElement.textContent = article.title;
    titleElement.className = "text-3xl font-bold font-headline mb-8";
    tempContainer.appendChild(titleElement);
    currentHeight += titleElement.offsetHeight;
    tempContainer.removeChild(titleElement);


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
    let targetPage = newPages.findIndex(pageContent => 
        pageContent.includes(article.content[targetParagraphIndex])
    )
    if (targetPage === -1) targetPage = 0;
    
    setCurrentPage(targetPage);
    
  }, [article])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const fetchedArticle = await getArticleById(params.id)
      if (!fetchedArticle) {
        notFound()
      }
      setArticle(fetchedArticle)
      setIsLoading(false)
    }
    fetchData()
  }, [params.id])

  useEffect(() => {
    if (!isLoading && article) {
      // Use requestAnimationFrame to ensure the DOM is painted before calculating.
      requestAnimationFrame(() => {
         calculatePages()
      })
    }
    window.addEventListener('resize', calculatePages)
    return () => window.removeEventListener('resize', calculatePages)
  }, [isLoading, article, calculatePages])

  useEffect(() => {
    if (pages.length > 0 && article && pages[currentPage]) {
        const firstParagraphOfPage = pages[currentPage][0];
        const paragraphIndex = article.content.indexOf(firstParagraphOfPage);
        // Simulate saving progress
        console.log(`模拟保存阅读进度：第 ${paragraphIndex} 段`);
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
  const progress = pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0;

  return (
    <div className="container mx-auto max-w-3xl p-4 h-screen flex flex-col">
        <main ref={pageRef} className="flex-grow overflow-hidden py-4">
             {pages.length > 0 ? (
                <div ref={contentRef} className="prose prose-lg dark:prose-invert max-w-none space-y-4 text-justify h-full" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                    {isFirstPage && (
                      <h1 className="text-3xl font-bold font-headline mb-8">{article.title}</h1>
                    )}
                    {pages[currentPage]?.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-full">
                  {isLoading ? '加载中...' : '正在计算分页...'}
                </div>
            )}
        </main>
        
        <footer className="flex-shrink-0">
           <Progress value={progress} className="h-1" />
           <div className="flex items-center justify-between py-4">
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
