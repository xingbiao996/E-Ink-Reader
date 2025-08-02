
"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { getSources } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Book, Trash2 } from 'lucide-react'
import { AddSourceForm } from '@/components/AddSourceForm'
import { deleteSourceAction } from '@/app/actions'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'
import type { Source } from '@/lib/types'

export default function SettingsPage() {
  const [sources, setSources] = useState<Source[]>([])
  const [pages, setPages] = useState<Source[][]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pageRef = useRef<HTMLDivElement>(null)

  const calculatePages = useCallback(() => {
    if (!sources.length || !pageRef.current || pageRef.current.clientHeight === 0) {
        setPages([])
        return
    };

    const pageHeight = pageRef.current.clientHeight
    const newPages: Source[][] = []

    const tempContainer = document.createElement('div');
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.position = 'absolute';
    tempContainer.style.width = `${pageRef.current.clientWidth}px`;
    tempContainer.className = `grid gap-4 sm:grid-cols-1 md:grid-cols-2`;
    document.body.appendChild(tempContainer);
    
    let tempCardHeight = 0;
    
    if (sources.length > 0) {
        const cardClone = document.createElement('div');
        cardClone.className = 'flex flex-col border rounded-lg'; // Corresponds to Card classes
        cardClone.innerHTML = `<div class="flex flex-row items-start justify-between gap-4 p-6"><div class="space-y-1.5"><div>Title</div><div class="line-clamp-1">Description</div></div><button>X</button></div><div class="p-6 pt-0 flex-grow flex flex-col justify-end"><div class="flex items-center justify-between text-sm"><div>Articles</div><button>View</button></div></div>`
        tempContainer.appendChild(cardClone);
        const gridGap = 16; // from gap-4
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

    for (let i = 0; i < sources.length; i += itemsPerPage) {
        newPages.push(sources.slice(i, i + itemsPerPage));
    }
    
    setPages(newPages)
  }, [sources])
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const fetchedSources = await getSources()
      setSources(fetchedSources)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if(!isLoading) {
        requestAnimationFrame(() => {
            calculatePages();
        });
        window.addEventListener('resize', calculatePages)
        return () => window.removeEventListener('resize', calculatePages)
    }
  }, [isLoading, sources, calculatePages])

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
        <main ref={pageRef} className="flex-grow overflow-hidden py-4 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-headline tracking-tight">设置</h1>
              <p className="text-muted-foreground">
                管理您导入的网页阅读源。
              </p>
            </div>
            
            <AddSourceForm />
            
            <div className="space-y-4">
                <h2 className="text-xl font-semibold font-headline">您的来源</h2>
                 {pages.length > 0 && pages[currentPage] ? (
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 h-full content-start">
                    {pages[currentPage].map((source) => (
                        <Card key={source.id} className="flex flex-col">
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div className="space-y-1.5">
                            <CardTitle className="font-headline">{source.name}</CardTitle>
                            <CardDescription className="line-clamp-1">{source.url}</CardDescription>
                            </div>
                            <form action={deleteSourceAction.bind(null, source.id)}>
                                <Button variant="ghost" size="icon" className="shrink-0" aria-label="删除来源">
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </form>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-end">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Book className="mr-1.5 h-4 w-4" />
                                    <span>{source.articleCount} 篇文章</span>
                                </div>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={`/source/${source.id}`}>
                                        查看文章 <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                        </Card>
                    ))}
                    </div>
                 ) : (
                    <Card className="flex items-center justify-center h-40">
                        <p className="text-muted-foreground">您还没有添加任何来源。</p>
                    </Card>
                 )}
            </div>
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
