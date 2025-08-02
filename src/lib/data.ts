import type { Source, Article } from './types';

const LOREM_IPSUM_PARAGRAPHS = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue.",
    "Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada.",
    "Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc.",
    "Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus.",
    "Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede.",
    "Pellentesque morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi.",
    "Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh. Quisque a lectus.",
    "Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi. Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc. Sed adipiscing ornare risus. Morbi est est, blandit sit amet, sagittis vel, euismod vel, velit. Pellentesque egestas, neque sit amet convallis pulvinar, justo nulla eleifend augue, ac auctor orci leo non est.",
    "Quisque nonummy magnam et, qui, ut. Eos, omnis unde id. Eius, ut, ut. Et, sed, ut. Cum, ut, et. Nisi, quis, ut. Id, ut, in. Nisi, quis, ut. Id, ut, in. Nisi, quis, ut. Id, ut, in. Nisi, quis, ut. Id, ut, in. Nisi, quis, ut. Id, ut, in. Nisi, quis, ut. Id, ut, in.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
    "Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
];

const mockSources: Source[] = [
  { id: '1', name: '科技博客', url: 'https://techreads.example.com', articleCount: 2 },
  { id: '2', name: '文学期刊', url: 'https://literaryjournal.example.com', articleCount: 1 },
  { id: '3', name: '科学周刊', url: 'https://scienceweekly.example.com', articleCount: 1 },
];

const mockArticles: Article[] = [
  { 
    id: '101', 
    sourceId: '1', 
    title: 'Web开发的未来', 
    content: LOREM_IPSUM_PARAGRAPHS.slice(0, 12)
  },
  { 
    id: '102', 
    sourceId: '1', 
    title: '理解量子计算', 
    content: LOREM_IPSUM_PARAGRAPHS.slice(4, 10)
  },
  { 
    id: '201', 
    sourceId: '2', 
    title: '古典文学的现代解读', 
    content: LOREM_IPSUM_PARAGRAPHS.slice(2, 9)
  },
   { 
    id: '301', 
    sourceId: '3', 
    title: '基因工程的突破', 
    content: LOREM_IPSUM_PARAGRAPHS.slice(0, 5)
  },
];

export async function getSources(): Promise<Source[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockSources), 50));
}

export async function getSourceById(id: string): Promise<Source | undefined> {
  return new Promise((resolve) => setTimeout(() => resolve(mockSources.find(s => s.id === id)), 50));
}

export async function getArticlesBySourceId(sourceId: string): Promise<Article[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockArticles.filter(a => a.sourceId === sourceId)), 50));
}

export async function getArticleById(id: string): Promise<Article | undefined> {
    return new Promise((resolve) => setTimeout(() => resolve(mockArticles.find(a => a.id === id)), 50));
}
