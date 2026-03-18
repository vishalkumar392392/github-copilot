import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getLinksByUserId } from '@/data/links';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateLinkDialog } from './create-link-dialog';
import { LinkActions } from './link-actions';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const links = await getLinksByUserId(userId);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Links</h1>
        <CreateLinkDialog />
      </div>
      {links.length === 0 ? (
        <p className="text-muted-foreground">
          No links yet. Create your first short link!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <Card key={link.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium truncate">
                  {link.originalUrl}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="font-mono">/{link.slug}</span>
                <div className="flex items-center gap-3">
                  <span>
                    {link.clicks} click{link.clicks !== 1 ? 's' : ''}
                  </span>
                  <LinkActions link={link} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
