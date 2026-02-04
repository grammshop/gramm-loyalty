import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Download, ShieldAlert, FileSpreadsheet, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';

const DownloadPage: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user && user.email && user.email.toLowerCase().includes('admin')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const q = query(collection(db, 'loyalty'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Parteneri');

      // Define columns
      const columns = [
        { header: 'DENUMIRE PARTENER', key: 'DENUMIRE', width: 0 },
        { header: 'COD FISCAL', key: 'COD_FISCAL', width: 0 },
        { header: 'ID TARA', key: 'ID_TARA', width: 0 },
        { header: 'PLATITOR TVA', key: 'PLATITOR_TVA', width: 0 },
        { header: 'E FURNIZOR', key: 'E_FURNIZOR', width: 0 },
        { header: 'E CLIENT', key: 'E_CLIENT', width: 0 },
        { header: 'NUMAR INREGISTRARE COMERT', key: 'NR_REG_COM', width: 0 },
        { header: 'ADRESA', key: 'ADRESA', width: 0 },
        { header: 'LOCALITATE', key: 'LOCALITATE', width: 0 },
        { header: 'JUDET', key: 'JUDET', width: 0 },
        { header: 'TELEFON', key: 'TELEFON', width: 0 },
        { header: 'BANCA', key: 'BANCA', width: 0 },
        { header: 'CONT', key: 'CONT', width: 0 },
        { header: 'ALIAS', key: 'ALIAS', width: 0 },
        { header: 'STARE', key: 'STARE', width: 0 },
        { header: 'E PERSOANA FIZICA', key: 'E_PERS_FIZICA', width: 0 },
        { header: 'COD CARD', key: 'COD_CARD', width: 0 },
        { header: 'ADRESA SITE WEB', key: 'WEB', width: 0 },
        { header: 'PERS. CONTACT', key: 'PERS_CONTACT', width: 0 },
        { header: 'FUNCTIE PERS. CONTACT', key: 'FUNCTIE_CONTACT', width: 0 },
        { header: 'TELEFON CONTACT', key: 'TEL_CONTACT', width: 0 },
        { header: 'EMAIL', key: 'EMAIL', width: 0 },
        { header: 'SCADENTA', key: 'SCADENTA', width: 0 },
        { header: 'CREDIT MAXIM', key: 'CREDIT_MAXIM', width: 0 },
        { header: 'PROCENT ADAOS', key: 'ADAOS', width: 0 },
        { header: 'DISCOUNT', key: 'DISCOUNT', width: 0 },
        { header: 'RANG', key: 'RANG', width: 0 },
        { header: 'ATASAT LA PARTENER', key: 'ATASAT_LA', width: 0 },
        { header: 'OBSERVATII', key: 'OBSERVATII', width: 0 },
        { header: 'SUMA ACORDATA', key: 'SUMA', width: 0 },
        { header: 'DATA SUMEI', key: 'DATA_SUMEI', width: 0 },
        { header: 'TARIF', key: 'TARIF', width: 0 },
        { header: 'CONT FURNIZOR', key: 'CONT_FURNIZOR', width: 0 },
        { header: 'CONT CLIENT', key: 'CONT_CLIENT', width: 0 },
        { header: 'CONT INCASARI', key: 'CONT_INCASARI', width: 0 },
        { header: 'DATA NASTERII', key: 'DATA_NASTERII', width: 0 },
        { header: 'PROCENT ANIVERSARE', key: 'PROCENT_ANIV', width: 0 },
        { header: 'CAPITAL SOCIAL', key: 'CAPITAL_SOCIAL', width: 0 },
        { header: 'STATII LIMITATE', key: 'STATII_LIM', width: 0 },
        { header: 'NR STATII', key: 'NR_STATII', width: 0 },
        { header: 'INDUSTRIE', key: 'INDUSTRIE', width: 0 },
        { header: 'DOMENIU', key: 'DOMENIU', width: 0 },
      ];

      // Set columns and initial width based on header length + padding
      worksheet.columns = columns.map(col => ({
        ...col,
        width: col.header.length + 5 // Add padding for "extinse cat sa incapa headerul"
      }));

      // Style Header Row
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF33CCCC' } // 33CCCC
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' }, // White
          bold: true
        };
      });

      // Add Data
      querySnapshot.docs.forEach(doc => {
        const d = doc.data();
        
        // Format DOB: YYYY-MM-DD -> DD.MM.YYYY
        let formattedDob = '';
        if (d.dob) {
            const parts = d.dob.split('-');
            if (parts.length === 3) {
                formattedDob = `${parts[2]}.${parts[1]}.${parts[0]}`;
            } else {
                formattedDob = d.dob;
            }
        }

        const fullName = `${d.firstName || ''} ${d.lastName || ''}`.trim();

        worksheet.addRow({
          DENUMIRE: fullName,
          COD_FISCAL: '',
          ID_TARA: '',
          PLATITOR_TVA: '',
          E_FURNIZOR: '',
          E_CLIENT: 1,
          NR_REG_COM: '',
          ADRESA: '',
          LOCALITATE: '',
          JUDET: '',
          TELEFON: d.phone || '',
          BANCA: '',
          CONT: '',
          ALIAS: '',
          STARE: '',
          E_PERS_FIZICA: 1,
          COD_CARD: '',
          WEB: '',
          PERS_CONTACT: '',
          FUNCTIE_CONTACT: '',
          TEL_CONTACT: '',
          EMAIL: d.email || '',
          SCADENTA: '',
          CREDIT_MAXIM: '',
          ADAOS: '',
          DISCOUNT: '',
          RANG: '',
          ATASAT_LA: '',
          OBSERVATII: '',
          SUMA: '',
          DATA_SUMEI: '',
          TARIF: '',
          CONT_FURNIZOR: '',
          CONT_CLIENT: '',
          CONT_INCASARI: '',
          DATA_NASTERII: formattedDob,
          PROCENT_ANIV: '',
          CAPITAL_SOCIAL: '',
          STATII_LIM: '',
          NR_STATII: '',
          INDUSTRIE: '',
          DOMENIU: ''
        });
      });

      // Generate file
      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
      const fileName = `Preluare parteneri ${dateStr}.xlsx`;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
      
    } catch (error) {
      console.error("Error downloading data: ", error);
      alert("A apărut o eroare la generarea fișierului. Vă rugăm să încercați din nou.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
         <div className="glass-morphism p-8 md:p-12 text-center max-w-md w-full">
            <h2 className="text-3xl font-bold mb-4">Autentificare Necesară</h2>
            <p className="text-theme-muted text-lg mb-6">Trebuie să fii autentificat pentru a accesa această pagină.</p>
            <a href="/" className="primary inline-block w-full">Mergi la Login</a>
         </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <button 
          onClick={() => logout()} 
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-theme-base transition-colors"
          title="Deconectare"
        >
          <LogOut className="w-6 h-6" />
        </button>
        <div className="glass-morphism p-8 md:p-12 text-center max-w-md w-full border-red-500/30">
            <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4 text-theme-base">Acces Interzis</h1>
            <p className="text-theme-muted text-lg">Nu ai permisiunea de a accesa această pagină. Această funcționalitate este rezervată administratorilor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <button 
          onClick={() => logout()} 
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-theme-base transition-colors"
          title="Deconectare"
        >
          <LogOut className="w-6 h-6" />
        </button>

        <div className="glass-morphism p-10 md:p-16 rounded-3xl flex flex-col items-center text-center max-w-lg w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-full mb-8">
               <FileSpreadsheet className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-4xl font-bold text-theme-base mb-4">Raport Parteneri</h1>
            <p className="text-theme-muted text-lg mb-10">
              Descarcă lista completă a partenerilor înregistrați în format Excel compatibil pentru import.
            </p>
            
            <button 
                onClick={handleDownload}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold text-xl py-5 px-8 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-green-600/20 disabled:opacity-70 disabled:grayscale disabled:pointer-events-none"
            >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Se generează...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    <span>Descarcă Excel (.xlsx)</span>
                  </>
                )}
            </button>

            <p className="mt-8 text-sm text-theme-muted opacity-70">
              Format: cu stiluri personalizate
            </p>
        </div>
    </div>
  );
};

export default DownloadPage;
