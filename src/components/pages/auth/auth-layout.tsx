import Image from 'next/image';
import Link from 'next/link';

// Importe seu logo. Coloque o arquivo `logo.svg` na pasta `public`.
// import Logo from '@/public/logo.svg'; 

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Coluna da Esquerda (Branding) */}
      {/* ALTERADO: Adicionamos 'relative' para ser o container da imagem */}
      <div className="relative hidden bg-secondary p-8 lg:flex lg:flex-col lg:justify-between">
        
        {/* NOVO: Componente de Imagem de Fundo */}
        <Image
            src="/images/background.jpg" // Caminho a partir da pasta 'public'
            alt="Imagem de fundo da autenticação"
            fill // Faz a imagem preencher toda a div pai
            quality={50} // Opcional: reduz a qualidade para carregar mais rápido
            className="object-cover opacity-10" // 'object-cover' evita distorção, 'opacity-10' a deixa bem clara
        />

        {/* O conteúdo original agora fica sobre a imagem */}
        <div className="relative z-10 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            {/* <Image src={Logo} alt="AgendaGo Logo" width={32} height={32} /> */}
            <span className='text-5xl'>AgendaGo</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-2 text-center">
            <h1 className="text-5xl font-bold tracking-tight">
                A ferramenta definitiva para otimizar seu tempo.
            </h1>
            <p className="">
                Agendamentos, clientes e finanças em um só lugar. Simples e poderoso.
            </p>
        </div>

        <footer className="relative z-10 text-sm text-slate-500">
          Painel do parceiro &copy; AgendaGo - {new Date().getFullYear()}
        </footer>
      </div>

      {/* Coluna da Direita (Formulário) */}
      <div className="relative flex flex-col items-center justify-center p-8">        
        <div className="flex w-full max-w-sm flex-col items-center justify-center space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">{subtitle}</p>
            </div>
            
            {/* O formulário (login ou cadastro) será renderizado aqui */}
            {children}
        </div>
      </div>
    </main>
  );
}