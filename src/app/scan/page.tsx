import CardScanner from '@/components/CardScanner';

export const metadata = {
    title: 'Scan Card | MTG Manager',
};

export default function ScanPage() {
    return (
        <div className="min-h-screen pt-4 pb-24 md:pt-24 md:pb-8 px-4">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2">Escanear Carta</h1>
                <p className="text-slate-400">Apunta con tu cámara a una carta Magic para identificarla.</p>
            </div>

            <CardScanner />
        </div>
    );
}
