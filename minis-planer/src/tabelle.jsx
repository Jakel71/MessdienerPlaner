import React, { useState } from 'react';
import './tabelle.css';

const Kirchen = [
    { id: 'martin', name: 'St. Martin' },
    { id: 'andreas', name: 'St. Andreas' },
    { id: 'petrus', name: 'St. Petrus' }
];

const GottesdienstTermine = [
    {
        id: '1', date: '21.06.2026', time: '10:00', kirchen: {
            'martin': { gottesdienstId: 'gd_102', typ: 'Eucharistiefeier' },
            'andreas': null,
            'petrus': { gottesdienstId: 'gd_103', typ: 'Eucharistiefeier' }
        }
    },
    {
        id: '2', date: '21.06.2026', time: '11:00', kirchen: {
            'martin': { gottesdienstId: 'gd_104', typ: 'Wort-Gottes-Feier' },
            'andreas': { gottesdienstId: null },
            'petrus': { gottesdienstId: null }
        }
    },
    {
        id: '3', date: '21.06.2026', time: '19:00', kirchen: {
            'martin': { gottesdienstId: 'gd_105', typ: 'Andacht' },
            'andreas': { gottesdienstId: null },
            'petrus': { gottesdienstId: 'gd_106', typ: 'Eucharistiefeier' }
        }
    }
];

export default function EintragsTabelle({ username }) {
    const [eintragungen, setEintragungen] = useState({});

    const handleAuswahl = (gottesdienstId, status) => {
        setEintragungen(prev => ({
            ...prev,
            [gottesdienstId]: prev[gottesdienstId] === status ? null : status
        }));
    };

    // Diese Funktion wird aufgerufen, wenn der Admin/Ministrant auf Speichern klickt
    const handleSpeichern = () => {
        if (!username || username.trim() === '') {
            alert('⚠️ Bitte trage zuerst oben deinen Namen ein!');
            return;
        }

        // Das ist das fertige Objekt, das exakt so in die Datenbank wandern wird!
        const eintragungsDaten = {
            ministrant: username.trim(),
            abgabeZeitpunkt: new Date().toISOString(),
            verfuegbarkeiten: eintragungen
        };

        console.log('Sende an Datenbank:', eintragungsDaten);
        alert(`Danke ${username}! Deine Rückmeldung wurde im Browser vorbereitet. Jetzt fehlt nur noch die echte Datenbank!`);
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
                                const aktuellerStatus = eintragungen[info?.gottesdienstId];

                                return (
                                    <td className="eintragungsTabelleReihe" key={kirche.id}>
                                        {info ? (
                                            <div className="gottesdienstZelle">
                                                <span className="gottesdienstTyp">{info.typ}</span>
                                                <div className="buttonGruppe">
                                                    <button
                                                        onClick={() => handleAuswahl(info.gottesdienstId, 'ja')}
                                                        className={`eintragungsTabelleButton btnZusage ${aktuellerStatus === 'ja' ? 'aktivZusage' : ''}`}
                                                    >
                                                        {aktuellerStatus === 'ja' ? '✓ Dabei' : 'Kann'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAuswahl(info.gottesdienstId, 'nein')}
                                                        className={`eintragungsTabelleButton btnAbsage ${aktuellerStatus === 'nein' ? 'aktivAbsage' : ''}`}
                                                    >
                                                        {aktuellerStatus === 'nein' ? '✕ Raus' : 'Kann nicht'}
                                                    </button>
                                                </div>
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

            {/* Der neue Speichern-Button unter der Tabelle */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button 
                    onClick={handleSpeichern} 
                    className="eintragungsTabelleButton aktivZusage"
                    style={{ padding: '12px 30px', fontSize: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                >
                    💾 Meine Termine absenden
                </button>
            </div>
        </div>
    );
}