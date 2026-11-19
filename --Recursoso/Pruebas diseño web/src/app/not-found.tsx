import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
            <div className="text-center space-y-4 max-w-sm">
                <h1 className="text-4xl font-bold text-foreground">Página no encontrada</h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                    El enlace que abriste no existe o cambió de lugar.
                </p>
                <Link href="/" className="inline-block font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
                    Ir al test de estrés
                </Link>
            </div>
        </div>
    );
}
