"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { getAllArticles } from '@/lib/data'
import { notFound, useRouter } from 'next/navigation'
import type { Article } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home, BookOpen, Library } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function LibraryPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [pages, setPages] = useState<Article[][]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pageRef = useRef<HTMLDivElement>(null)

  const calculatePages = useCallback(() => {
    if (!articles.length || !pageRef.current) return;

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
      cardClone.className = 'flex items-center justify-between p-4'; // Corresponds to Card's classes
      cardClone.innerHTML = `<div><div><h3>Title</h3></div><div><p>Source</p></div></div><button>Details</button>`;
      tempContainer.appendChild(cardClone);
      tempCardHeight = cardClone.offsetHeight + 16; // Include grid gap
      tempContainer.removeChild(cardClone);
    }
    
    if (tempCardHeight === 0) {
        document.body.removeChild(tempContainer);
        return;
    }
    
    const itemsPerPage = Math.floor(pageHeight / tempCardHeight);
    
    for (let i = 0; i < articles.length; i += itemsPerPage) {
        newPages.push(articles.slice(i, i + itemsPerPage));
    }

    document.body.removeChild(tempContainer);
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
      calculatePages();
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
  const isLastPage = currentPage === pages.length - 1;


  if (isLoading) {
    return <div className="container mx-auto max-w-4xl p-4 flex justify-center items-center h-screen">加载中...</div>
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
      <header className="py-4 border-b mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
              <Library className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold font-headline tracking-tight">图书馆</h1>
          </div>
          <Button onClick={() => router.push('/sources')} variant="outline">
              管理来源
          </Button>
        </div>
      </header>

      <main ref={pageRef} className="flex-grow overflow-hidden">
        {pages.length > 0 ? (
          <div className="grid gap-4 h-full">
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
            <Card className="flex items-center justify-center h-40 w-full">
                <p className="text-muted-foreground">图书馆中没有书籍。请先添加来源。</p>
            </Card>
          </div>
        )}
      </main>

       <footer className="py-4 border-t mt-4 flex-shrink-0">
            <div className="flex items-center justify-between">
                <Button onClick={handlePrevPage} variant="outline" disabled={isFirstPage || pages.length === 0} className={isFirstPage || pages.length === 0 ? "pointer-events-none opacity-50" : ""}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    上一页
                </Button>
                
                <Button onClick={() => router.push('/')} variant="ghost">
                    <Home className="mr-2 h-4 w-4" />
                    返回书架
                </Button>

                <Button onClick={handleNextPage} variant="outline" disabled={isLastPage || pages.length === 0} className={isLastPage || pages.length === 0 ? "pointer-events-none opacity-50" : ""}>
                    下一页
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
      </footer>
    </div>
  )
}
