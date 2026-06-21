import React, { useState, useEffect } from 'react';
import './tabelle.css';
import { supabase } from './supabaseClient';

const Kirchen = [
    { id: 'martin', name: 'St. Martin' },
    { id: 'andreas', name: 'St. Andreas' },
    { id: 'petrus', name: 'St. Petrus' }
];

export default function EintragsTabelle({ username }) {
    // State speichert jetzt: gottesdienstId → true (wenn ausgewählt) oder false/undefined
    const [eintragungen, setEintragungen] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [GottesdienstTermine, setGottesdienstTermine] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        async function ladeGottesdienste() {
            try {
                const { data, error } = await supabase
                    .from('gottesdienste')
                    .select('*')
                    .order('time', { ascending: true }); // Nach Uhrzeit sortieren

                if (error) throw error;
                setGottesdienstTermine(data || []);
            } catch (error) {
                console.error('Fehler beim Laden der Gottesdienste:', error.message);
                alert('Messen konnten nicht geladen werden.');
            } finally {
                setIsLoading(false);
            }
        }

        ladeGottesdienste();
    }, []);


    const handleAuswahl = (gottesdienstId) => {
        setEintragungen(prev => ({
            ...prev,
            // Kehrt den aktuellen Wert einfach um (true -> false / undefined -> true)
            [gottesdienstId]: !prev[gottesdienstId]
        }));
    };

    const handleSpeichern = async () => {
        if (!username || username.trim() === '') {
            alert('⚠️ Bitte trage zuerst oben deinen Namen ein!');
            return;
        }

        setIsSaving(true);

        // Filtere nur die IDs heraus, die auf "true" (aktiv) geklickt wurden
        const aktiveZusagen = Object.keys(eintragungen).filter(id => eintragungen[id] === true);

        try {
            // Sende die Daten live an deine Supabase-Tabelle "zusagen"
            const { error } = await supabase
                .from('zusagen')
                .insert([
                    {
                        ministrant: username.trim(),
                        gottesdienst_ids: aktiveZusagen
                    }
                ]);

            if (error) throw error;

            alert(`🎉 Danke ${username}! Deine Termine wurden erfolgreich gespeichert.`);
            setEintragungen({}); // Formular nach Erfolg leeren
        } catch (error) {
            console.error('Fehler beim Speichern:', error.message);
            alert('❌ Fehler beim Speichern. Bitte versuche es noch einmal.');
        } finally {
            setIsSaving(false);
        }

        if (isLoading) {
            return <div className="tabellenContainer">⏳ Gottesdienste werden geladen...</div>;
        }
    };

    return (
        <div className="tabellenContainer">
            <table className="eintragsTabelle">
                <thead>
                    <tr className="eintragungsTabelleKopfzeile">
                        <th className="eintragungsTabelleSpalte">Datum &amp; Uhrzeit</th>
                        {Kirchen.map(kirche => (
                            <th className="eintragungsTabelleSpalte" key={kirche.id}>
                                {kirche.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {GottesdienstTermine.map(termin => (
                        <tr key={termin.id} className="eintragungsTabelleZeile">
                            <td className="eintragungsTabelleReihe datumSpalte">
                                <span className="terminDatum">{termin.date}</span>
                                <span className="terminUhrzeit">{termin.time} Uhr</span>
                            </td>

                            {Kirchen.map(kirche => {
                                const eintrag = termin.kirchen[kirche.id];
                                const info = eintrag && eintrag.gottesdienstId ? eintrag : null;
                                const istAusgewaehlt = !!eintragungen[info?.gottesdienstId];

                                return (
                                    <td className="eintragungsTabelleReihe" key={kirche.id}>
                                        {info ? (
                                            <div className="gottesdienstZelle">
                                                <span className="gottesdienstTyp">{info.typ}</span>
                                                <button
                                                    onClick={() => handleAuswahl(info.gottesdienstId)}
                                                    className={`eintragungsTabelleButton btnZusage ${istAusgewaehlt ? 'aktivZusage' : ''}`}
                                                    style={{ width: '100%', minWidth: '110px' }}
                                                >
                                                    {istAusgewaehlt ? '✓ Bin dabei' : 'Kann dienen'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="keinGottesdienst">
                                                <span className="kreuzIcon">❌</span>
                                                <span className="kreuzText">Kein GD</span>
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    onClick={handleSpeichern}
                    className="eintragungsTabelleButton aktivZusage"
                    style={{ padding: '12px 30px', fontSize: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    disabled={isSaving}
                >
                    {isSaving ? 'Speichern...' : '💾 Eintragung absenden'}
                </button>
            </div>
        </div>
    );
}