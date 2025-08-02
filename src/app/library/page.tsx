
"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { getAllArticles } from '@/lib/data'
import { notFound, useRouter } from 'next/navigation'
import type { Article } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from '@/components/ui/progress'


export default function LibraryPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [pages, setPages] = useState<Article[][]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pageRef = useRef<HTMLDivElement>(null)

  const calculatePages = useCallback(() => {
    if (!articles.length || !pageRef.current || pageRef.current.clientHeight === 0) return;

    const pageHeight = pageRef.current.clientHeight;
    const newPages: Article[][] = [];

    const tempContainer = document.createElement('div');
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.position = 'absolute';
    tempContainer.style.width = `${pageRef.current.clientWidth}px`;
    tempContainer.className = 'grid gap-4';
    document.body.appendChild(tempContainer);
    
    let tempCardHeight = 0;

    if (articles.length > 0) {
      const cardClone = document.createElement('div');
      cardClone.className = 'flex items-center justify-between p-4 border rounded-lg'; // Corresponds to Card's classes
      cardClone.innerHTML = `<div><div><h3>Title</h3></div><div><p>Source</p></div></div><button>Details</button>`;
      tempContainer.appendChild(cardClone);
      const cardStyle = window.getComputedStyle(cardClone);
      const gridGap = 16; // from `gap-4`
      tempCardHeight = cardClone.offsetHeight + gridGap;
      tempContainer.removeChild(cardClone);
    }
    
    document.body.removeChild(tempContainer);

    if (tempCardHeight === 0) {
        setPages([]);
        return;
    }
    
    const itemsPerPage = Math.floor(pageHeight / tempCardHeight);
     if (itemsPerPage <= 0) {
        setPages([]);
        return;
    }
    
    for (let i = 0; i < articles.length; i += itemsPerPage) {
        newPages.push(articles.slice(i, i + itemsPerPage));
    }

    setPages(newPages);
  }, [articles]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const fetchedArticles = await getAllArticles()
      if (!fetchedArticles) {
        notFound()
      }
      setArticles(fetchedArticles)
      setIsLoading(false)
    }
    fetchData()
  }, [])
  
  useEffect(() => {
    if (!isLoading && articles.length > 0) {
      // Use requestAnimationFrame to ensure the DOM is painted before calculating.
      requestAnimationFrame(() => {
        calculatePages();
      });
    }
    window.addEventListener('resize', calculatePages);
    return () => window.removeEventListener('resize', calculatePages);
  }, [isLoading, articles, calculatePages]);


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
  
  const isFirstPage = currentPage === 0;
  const isLastPage = pages.length > 0 ? currentPage >= pages.length - 1 : true;
  const progress = pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0;


  if (isLoading) {
    return <div className="container mx-auto max-w-4xl p-4 flex justify-center items-center h-screen">加载中...</div>
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
      <main ref={pageRef} className="flex-grow overflow-hidden py-4">
        {pages.length > 0 && pages[currentPage] ? (
          <div className="grid gap-4 h-full content-start">
            {pages[currentPage].map((article) => (
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
           <div className="flex items-center justify-center h-full">
            {isLoading ? (
               <p className="text-muted-foreground">正在计算分页...</p>
            ) : (
              <Card className="flex items-center justify-center h-40 w-full">
                  <p className="text-muted-foreground">图书馆中没有书籍。请先添加来源。</p>
              </Card>
            )}
          </div>
        )}
      </main>

       <footer className="flex-shrink-0">
            <Progress value={progress} className="h-1" />
            <div className="flex items-center justify-between py-4">
                <Button onClick={handlePrevPage} variant="outline" disabled={isFirstPage || pages.length === 0} className={isFirstPage || pages.length === 0 ? "pointer-events-none opacity-50" : ""}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    上一页
                </Button>
                
                 <div className="flex items-center gap-4">
                   <Button onClick={() => router.push('/')} variant="ghost">
                     书架
                   </Button>
                    <Button onClick={() => router.push('/library')} variant="ghost">
                     图书馆
                   </Button>
                   <Button onClick={() => router.push('/sources')} variant="ghost">
                    管理来源
                  </Button>
              </div>

                <Button onClick={handleNextPage} variant="outline" disabled={isLastPage || pages.length === 0} className={isLastPage || pages.length === 0 ? "pointer-events-none opacity-50" : ""}>
                    下一页
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
      </footer>
    </div>
  )
}
