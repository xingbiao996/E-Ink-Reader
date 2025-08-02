'use server'

import { revalidatePath } from 'next/cache'

// 在真实的应用程序中，这些操作会与数据库交互。
// 在这个演示中，它们只在控制台输出日志来模拟行为。

export async function addSourceAction(formData: FormData) {
  const url = formData.get('url')
  if (typeof url !== 'string' || !url) {
    return { success: false, message: '无效的URL' };
  }
  console.log(`模拟：添加来源URL: ${url}`)
  
  // 如果有数据库，我们会添加源然后重新验证。
  // revalidatePath('/')
  
  return { success: true, message: '来源已添加（模拟）。' }
}

export async function deleteSourceAction(id: string) {
    if (typeof id !== 'string' || !id) {
        return { success: false, message: '无效的来源ID' };
    }
    console.log(`模拟：删除来源ID: ${id}`)

    // 如果有数据库，我们会删除源然后重新验证。
    // revalidatePath('/')

    return { success: true, message: '来源已删除（模拟）。' }
}
