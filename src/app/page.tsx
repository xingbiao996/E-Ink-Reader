
"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { getShelfBooks } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import type { Article } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function BookshelfPage() {
  const [shelfBooks, setShelfBooks] = useState<Article[]>([])
  const [pages, setPages] = useState<Article[][]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const pageRef = useRef<HTMLDivElement>(null)
  
  const calculatePages = useCallback(() => {
    if (!shelfBooks.length || !pageRef.current || pageRef.current.clientHeight === 0) {
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
      setPages([]);
      return;
    }
    
    const welcomeCard = pageRef.current.querySelector('#welcome-card')
    const welcomeCardHeight = welcomeCard ? welcomeCard.clientHeight + 24 : 0; // 24 is for gap-6
    const availableHeight = pageHeight - welcomeCardHeight;
    
    const rowsPerPage = Math.floor(availableHeight / tempCardHeight);
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
    if(!isLoading) {
        // Use requestAnimationFrame to ensure the DOM is painted before calculating.
        requestAnimationFrame(() => {
            calculatePages();
        });
        window.addEventListener('resize', calculatePages)
        return () => window.removeEventListener('resize', calculatePages)
    }
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
  const isLastPage = pages.length > 0 ? currentPage >= pages.length - 1 : true;
  const progress = pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0;

  if (isLoading) {
    return <div className="container mx-auto max-w-4xl p-4 flex justify-center items-center h-screen">加载中...</div>
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
      <main ref={pageRef} className="flex-grow overflow-hidden py-4">
        <Card id="welcome-card" className="mb-6">
            <CardHeader>
                <CardTitle>欢迎使用 E-Ink Reader</CardTitle>
                <CardDescription>（stcn之父徒儿开发）</CardDescription>
            </CardHeader>
        </Card>
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
                <Card className="w-full p-6 text-center">
                    <CardTitle className="mb-2">您的书架是空的</CardTitle>
                    <CardDescription className="mb-4">
                        从图书馆添加一些书籍开始阅读。
                    </CardDescription>
                    <Button asChild>
                        <Link href="/library">前往图书馆</Link>
                    </Button>
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
                    设置
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
