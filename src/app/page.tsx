"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { getShelfBooks } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home, BookOpen, Library } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import type { Article } from '@/lib/types'

export default function BookshelfPage() {
  const [shelfBooks, setShelfBooks] = useState<Article[]>([])
  const [pages, setPages] = useState<Article[][]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const pageRef = useRef<HTMLDivElement>(null)
  
  const calculatePages = useCallback(() => {
    if (!shelfBooks.length || !pageRef.current) {
        setPages([]);
        return;
    };

    const pageHeight = pageRef.current.clientHeight;
    const pageWidth = pageRef.current.clientWidth;
    
    // Determine columns based on page width
    let numColumns = 1;
    if (pageWidth >= 1024) numColumns = 4; // lg
    else if (pageWidth >= 768) numColumns = 3; // md
    else if (pageWidth >= 640) numColumns = 2; // sm

    const newPages: Article[][] = []
    
    const tempContainer = document.createElement('div');
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.position = 'absolute';
    tempContainer.style.width = `${pageWidth}px`;
    tempContainer.className = `grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
    document.body.appendChild(tempContainer);

    let tempCardHeight = 0;

    // Measure a single card's height
    if (shelfBooks.length > 0) {
      const cardClone = document.createElement('div')
      cardClone.className = "flex flex-col group border rounded-lg"; // Corresponds to Card's classes
      // Simple inner structure for height calculation
      cardClone.innerHTML = `<div class="p-4 flex-1"><h3 class="font-headline text-lg mb-2 group-hover:underline">Title</h3><p class="text-xs flex items-center gap-1.5">Source</p></div><div class="p-4 pt-0"><div class="h-2 mb-2 w-full"></div><div class="text-xs">Progress</div></div>`
      tempContainer.appendChild(cardClone);
      const gridGap = 24; // from gap-6
      tempCardHeight = cardClone.offsetHeight + gridGap;
      tempContainer.removeChild(cardClone);
    }
    
    document.body.removeChild(tempContainer);

    if(tempCardHeight === 0) {
      return;
    }
    
    const rowsPerPage = Math.floor(pageHeight / tempCardHeight);
    const itemsPerPage = rowsPerPage * numColumns;
    
    if (itemsPerPage <= 0) {
        setPages([]);
        return;
    }

    for (let i = 0; i < shelfBooks.length; i += itemsPerPage) {
        newPages.push(shelfBooks.slice(i, i + itemsPerPage));
    }

    setPages(newPages)
  }, [shelfBooks])


  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const books = await getShelfBooks()
      setShelfBooks(books)
      setIsLoading(false)
    }
    fetchData()
  }, [])
  
  useEffect(() => {
    // Use requestAnimationFrame to ensure the DOM is painted before calculating.
    requestAnimationFrame(() => {
        calculatePages();
    });
    window.addEventListener('resize', calculatePages)
    return () => window.removeEventListener('resize', calculatePages)
  }, [isLoading, shelfBooks, calculatePages])


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
  const isLastPage = pages.length - 1 <= currentPage

  if (isLoading) {
    return <div className="container mx-auto max-w-6xl p-4 flex justify-center items-center h-screen">加载中...</div>
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 h-screen flex flex-col">
      <header className="py-4 border-b mb-4 flex-shrink-0">
          <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold font-headline tracking-tight">书架</h1>
              <Button asChild>
                  <Link href="/library">
                      前往图书馆 <Library className="ml-2 h-4 w-4" />
                  </Link>
              </Button>
          </div>
      </header>

      <main ref={pageRef} className="flex-grow overflow-hidden">
        {pages.length > 0 && pages[currentPage] ? (
           <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-full content-start">
              {pages[currentPage].map((book) => (
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
        ) : (
          <div className="flex items-center justify-center h-full">
             {isLoading ? (
               <p className="text-muted-foreground">正在计算分页...</p>
             ) : (
                <Card className="flex items-center justify-center h-40 w-full">
                  <p className="text-muted-foreground">您的书架是空的。请先从图书馆添加书籍。</p>
                </Card>
             )}
          </div>
        )}
      </main>

      <footer className="py-4 border-t mt-4 flex-shrink-0">
          <div className="flex items-center justify-between">
              <Button onClick={handlePrevPage} variant="outline" disabled={isFirstPage || pages.length === 0} className={isFirstPage || pages.length === 0 ? "pointer-events-none opacity-50" : ""}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  上一页
              </Button>
              
              <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-muted-foreground">
                    {pages.length > 0 ? `第 ${currentPage + 1} 页 / 共 ${pages.length} 页` : `第 0 / 0 页`}
                  </span>
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
