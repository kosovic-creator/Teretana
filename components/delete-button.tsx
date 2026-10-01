"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteButton({ field, value, action }: { field: string; value: string; action: (formData: FormData) => void | Promise<void> }) {
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        if (!isConfirming) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsConfirming(false);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isConfirming]);

    function closeConfirmation() {
        setIsConfirming(false);
    }

    return (
        <form action={action}>
            <input type="hidden" name={field} value={value} />
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-red-700/60 bg-red-950/30 text-red-200 hover:border-red-500 hover:bg-red-950/50"
                onClick={() => setIsConfirming(true)}
            >
                <Trash2 className="size-4" />Obriši
            </Button>
            {isConfirming && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-[2px]"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) closeConfirmation();
                    }}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-confirmation-title"
                        aria-describedby="delete-confirmation-description"
                        className="w-full max-w-sm rounded-xl border bg-background p-6 shadow-xl"
                    >
                        <div className="mb-4 flex items-start gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-700">
                                <AlertTriangle className="size-5" />
                            </span>
                            <div>
                                <h2 id="delete-confirmation-title" className="font-bold">Obrisati zapis?</h2>
                                <p id="delete-confirmation-description" className="mt-1 text-sm text-muted-foreground">
                                    Ova radnja je trajna i ne može se poništiti.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button autoFocus type="button" variant="outline" onClick={closeConfirmation}>
                                Odustani
                            </Button>
                            <Button type="submit" variant="destructive">
                                <Trash2 className="size-4" />Obriši
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}