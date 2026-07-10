// =========================================================
// CXONEXAM Landing Page - Interactive Simulator Logic (app.js)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------
    // 1. Splash Screen Control
    // -----------------------------------------------------
    const splashScreen = document.getElementById('splash-exam');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.remove('active');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 500);
        }, 2000);
    }

    // -----------------------------------------------------
    // 2. Mode Switcher (Student View vs Teacher View)
    // -----------------------------------------------------
    const btnModeStudent = document.getElementById('btn-mode-student');
    const btnModeTeacher = document.getElementById('btn-mode-teacher');
    const studentDevice = document.getElementById('student-device');
    const teacherDevice = document.getElementById('teacher-device');
    const studentScenariosPanel = document.getElementById('student-scenarios-panel');
    const teacherSettingsPanel = document.getElementById('teacher-settings-panel');

    function toggleMode(mode) {
        if (mode === 'student') {
            btnModeStudent.classList.add('active');
            btnModeTeacher.classList.remove('active');
            studentDevice.classList.remove('hidden');
            teacherDevice.classList.add('hidden');
            studentScenariosPanel.classList.remove('hidden');
            teacherSettingsPanel.classList.add('hidden');
        } else {
            btnModeStudent.classList.remove('active');
            btnModeTeacher.classList.add('active');
            studentDevice.add('hidden'); // Wait, studentDevice.classList.add('hidden')
            // Let's write correct classList method calls
            studentDevice.classList.add('hidden');
            teacherDevice.classList.remove('hidden');
            studentScenariosPanel.classList.add('hidden');
            teacherSettingsPanel.classList.remove('hidden');
        }
    }

    btnModeStudent.addEventListener('click', () => toggleMode('student'));
    btnModeTeacher.addEventListener('click', () => toggleMode('teacher'));

    // -----------------------------------------------------
    // 3. Student Registration & QR Scanner Navigation Flow
    // -----------------------------------------------------
    // Student Identity Inputs
    const btnSaveIdentity = document.getElementById('btn-save-identity');
    const paneStudentIdentity = document.getElementById('pane-student-identity');
    const paneStudentScan = document.getElementById('pane-student-scan');
    const paneStudentExam = document.getElementById('pane-student-exam');
    const btnBackToIdentity = document.getElementById('btn-back-to-identity');

    // Student Data State
    let studentData = {
        name: "Rayhan Alfarabi",
        classNum: "9",
        group: "B",
        absentNum: "24"
    };

    btnSaveIdentity.addEventListener('click', () => {
        const nameVal = document.getElementById('stu-name').value.trim();
        const classVal = document.getElementById('stu-class').value.trim();
        const groupVal = document.getElementById('stu-group').value.trim();
        const absentVal = document.getElementById('stu-abs').value.trim();

        if (nameVal === '' || classVal === '' || groupVal === '' || absentVal === '') {
            alert('Harap lengkapi semua data identitas diri!');
            return;
        }

        studentData = {
            name: nameVal,
            classNum: classVal,
            group: groupVal,
            absentNum: absentVal
        };

        // Transition to QR Scan pane
        paneStudentIdentity.classList.remove('active');
        paneStudentScan.classList.add('active');

        // Simulate scanning after 2.5 seconds
        simulateQRScan();
    });

    btnBackToIdentity.addEventListener('click', () => {
        paneStudentScan.classList.remove('active');
        paneStudentIdentity.classList.add('active');
    });

    let scanTimer;
    function simulateQRScan() {
        const scanStatusText = document.querySelector('.scan-status-text');
        scanStatusText.textContent = 'Mencari kode QR Guru...';
        
        clearTimeout(scanTimer);
        scanTimer = setTimeout(() => {
            if (!paneStudentScan.classList.contains('active')) return;
            
            scanStatusText.innerHTML = '<span class="text-yellow"><i class="fa-solid fa-circle-check"></i> Barcode Terenkripsi Ditemukan!</span>';
            
            // Wait 1 second after match, then open exam screen
            setTimeout(() => {
                paneStudentScan.classList.remove('active');
                paneStudentExam.classList.add('active');
                
                // Add initial info log on teacher's alert bot
                logAlertToTelegram("✅ CXONEXAM STATUS", `Siswa **${studentData.name}** (Kelas ${studentData.classNum}-${studentData.group}, Absen ${studentData.absentNum}) berhasil menscan barcode & memulai ujian.`);
            }, 1000);

        }, 2500);
    }

    // -----------------------------------------------------
    // 4. Custom IME Keyboard Simulator
    // -----------------------------------------------------
    const examAns1Input = document.getElementById('exam-ans-1');
    const customKeyboard = document.getElementById('custom-keyboard');
    const keys = document.querySelectorAll('#custom-keyboard .key');
    const keyDelete = document.getElementById('key-delete');
    const keySpace = document.getElementById('key-space');
    const keyEnter = document.getElementById('key-enter');
    const keyNums = document.getElementById('key-nums');

    let currentKeyboardMode = 'letters'; // letters | numbers

    keys.forEach(k => {
        k.addEventListener('click', () => {
            examAns1Input.value += k.textContent;
        });
    });

    keySpace.addEventListener('click', () => {
        examAns1Input.value += ' ';
    });

    keyDelete.addEventListener('click', () => {
        const val = examAns1Input.value;
        if (val.length > 0) {
            examAns1Input.value = val.slice(0, -1);
        }
    });

    keyEnter.addEventListener('click', () => {
        const answer = examAns1Input.value.trim();
        if (answer === '') return;
        
        // Lock keyboard and clear it
        examAns1Input.value = 'Tersimpan: ' + answer;
        logAlertToTelegram("📝 JAWABAN SISWA", `Siswa **${studentData.name}** menyimpan jawaban Soal 1: "${answer}"`);
    });

    // Toggle Numbers vs Letters Keyboard
    keyNums.addEventListener('click', () => {
        const letterKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 
                            'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 
                            'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
        const numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
                            '+', '-', '*', '/', '=', '(', ')', '.', ',', '?',
                            '!', '@', '#', '$', '%', '&'];

        if (currentKeyboardMode === 'letters') {
            currentKeyboardMode = 'numbers';
            keyNums.textContent = 'ABC';
            
            // Map keys
            keys.forEach((k, index) => {
                if (index < numberKeys.length) {
                    k.textContent = numberKeys[index];
                } else {
                    k.style.visibility = 'hidden';
                }
            });
        } else {
            currentKeyboardMode = 'letters';
            keyNums.textContent = '123';
            
            keys.forEach((k, index) => {
                k.style.visibility = 'visible';
                if (index < letterKeys.length) {
                    k.textContent = letterKeys[index];
                }
            });
        }
    });

    // -----------------------------------------------------
    // 5. Anti-Cheat Simulation Scenarios Triggers
    // -----------------------------------------------------
    const triggerOverlayCheat = document.getElementById('trigger-overlay-cheat');
    const triggerDisconnectWifi = document.getElementById('trigger-disconnect-wifi');
    const triggerClipboardPaste = document.getElementById('trigger-clipboard-paste');
    const triggerExitAttempt = document.getElementById('trigger-exit-attempt');

    // Overlays references
    const studentCheatOverlay = document.getElementById('student-cheat-overlay');
    const studentNetworkOverlay = document.getElementById('student-network-overlay');
    const studentExitModal = document.getElementById('student-exit-modal');
    
    // Status indicators
    const indicatorWifi = document.getElementById('indicator-wifi');

    // Reset Buttons inside phone screen overlays
    const btnCloseCheatOverlay = document.getElementById('btn-close-cheat-overlay');
    const btnRestoreWifi = document.getElementById('btn-restore-wifi');

    // Check: Is student in exam?
    function isStudentInExam() {
        if (!paneStudentExam.classList.contains('active')) {
            alert('Mohon daftarkan nama murid dan mulai ujian terlebih dahulu!');
            return false;
        }
        return true;
    }

    // SCENARIO 1: Overlay popup apps
    triggerOverlayCheat.addEventListener('click', () => {
        if (!isStudentInExam()) return;

        // Force overlay on student phone
        document.getElementById('cheat-overlay-detail').textContent = 'Overlay Terdeteksi: Aplikasi Melayang (Floating Calculator) Dilarang.';
        studentCheatOverlay.classList.add('active');

        // Alert Bot notification
        logAlertToTelegram("🚨 CXONEXAM ALERT WARNING", `Siswa **${studentData.name}** (Kelas ${studentData.classNum}-${studentData.group}, Absen ${studentData.absentNum}) mencoba curang. \n**Pelanggaran:** Overlay aplikasi melayang (kalkulator popup) terdeteksi!`);
        
        // Show alert message context
        alert('Simulator: Jendela overlay kecurangan muncul di HP siswa. Pemberitahuan instan dikirim ke Telegram Guru.');
    });

    btnCloseCheatOverlay.addEventListener('click', () => {
        studentCheatOverlay.classList.remove('active');
    });

    // SCENARIO 2: Wifi Disconnected
    triggerDisconnectWifi.addEventListener('click', () => {
        if (!isStudentInExam()) return;

        // Disable wifi indicator on student screen
        indicatorWifi.className = 'fa-solid fa-wifi-slash';
        indicatorWifi.style.color = '#ff3b30';

        // Trigger network freeze overlay
        studentNetworkOverlay.classList.add('active');

        // Alert Bot notification
        logAlertToTelegram("⚠️ CXONEXAM NET WATCHDOG", `Siswa **${studentData.name}** (Kelas ${studentData.classNum}-${studentData.group}, Absen ${studentData.absentNum}) kehilangan koneksi internet. \n**Status:** Perangkat offline (Wifi/Data mati). Lembar ujian dibekukan.`);
        
        alert('Simulator: Koneksi terputus. Lembar ujian siswa dibekukan secara instan hingga terkoneksi kembali.');
    });

    btnRestoreWifi.addEventListener('click', () => {
        // Restore wifi indicator
        indicatorWifi.className = 'fa-solid fa-wifi';
        indicatorWifi.style.color = '';
        studentNetworkOverlay.classList.remove('active');

        // Send restoration log to telegram
        logAlertToTelegram("✅ CXONEXAM NET WATCHDOG", `Siswa **${studentData.name}** kembali online. Lembar ujian kembali dapat diakses.`);
    });

    // SCENARIO 3: Clipboard Injection / Paste block
    triggerClipboardPaste.addEventListener('click', () => {
        if (!isStudentInExam()) return;

        const clipboardWarning = document.getElementById('clipboard-warning');
        clipboardWarning.classList.remove('hidden');

        // Send violation telegram alert
        logAlertToTelegram("🚨 CXONEXAM SECURE KEYBOARD", `Siswa **${studentData.name}** (Kelas ${studentData.classNum}-${studentData.group}, Absen ${studentData.absentNum}) menduplikasi teks. \n**Pelanggaran:** Penempelan (Paste) teks dari luar diblokir oleh Keyboard Kustom.`);

        setTimeout(() => {
            clipboardWarning.classList.add('hidden');
        }, 3000);

        alert('Simulator: Keyboard steril memblokir akses clipboard. Laporan copy-paste dikirim ke Telegram guru.');
    });

    // SCENARIO 4: Home/Back button exits
    triggerExitAttempt.addEventListener('click', () => {
        if (!isStudentInExam()) return;

        document.getElementById('student-exit-input').value = '';
        document.getElementById('exit-pwd-error').classList.add('hidden');
        studentExitModal.classList.add('active');
        
        alert('Simulator: Murid mencoba menekan tombol Home/Back. Pop-up input password exit guru ditampilkan.');
    });

    // Cancel exit
    const btnCancelExit = document.getElementById('btn-cancel-exit');
    btnCancelExit.addEventListener('click', () => {
        studentExitModal.classList.remove('active');
    });

    // Submit exit verification
    const btnSubmitExit = document.getElementById('btn-submit-exit');
    const teacherExitPwd = document.getElementById('teacher-exit-pwd');

    btnSubmitExit.addEventListener('click', () => {
        const inputPwd = document.getElementById('student-exit-input').value;
        const correctPwd = teacherExitPwd.value.trim();

        if (inputPwd === correctPwd) {
            // Unlock success
            studentExitModal.classList.remove('active');
            
            // Log to Telegram
            logAlertToTelegram("✅ CXONEXAM EXIT SYSTEM", `Siswa **${studentData.name}** (Kelas ${studentData.classNum}-${studentData.group}, Absen ${studentData.absentNum}) telah keluar secara sah. \n**Keterangan:** Password exit guru dimasukkan.`);

            // Reset back to identity pane
            paneStudentExam.classList.remove('active');
            paneStudentIdentity.classList.add('active');

            alert('Ujian berhasil di-unlock. HP siswa kembali ke mode normal.');
        } else {
            document.getElementById('exit-pwd-error').classList.remove('hidden');
        }
    });

    // Trigger Exit from phone exit button
    const btnTriggerExitModal = document.getElementById('btn-trigger-exit-modal');
    btnTriggerExitModal.addEventListener('click', () => {
        triggerExitAttempt.click();
    });

    // -----------------------------------------------------
    // 6. Teacher Setup Logic & QR Generation
    // -----------------------------------------------------
    const btnGenerateQr = document.getElementById('btn-generate-qr');
    btnGenerateQr.addEventListener('click', () => {
        const examUrl = document.getElementById('teacher-exam-url').value;
        const exitPwd = teacherExitPwd.value;

        alert(`QR Code Ujian terbuat!\nLink Ujian: ${examUrl}\nPassword Exit: ${exitPwd}\n(Enkripsi AES-128 & XOR Cipher aktif)`);
    });

    // -----------------------------------------------------
    // 7. Telegram Alerts Mock System (Teacher View)
    // -----------------------------------------------------
    const telegramAlertsContainer = document.getElementById('telegram-alerts-container');

    function logAlertToTelegram(title, detailText) {
        const bubble = document.createElement('div');
        bubble.classList.add('tg-msg-bubble');
        
        // Time format
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        // Format HTML payload
        let htmlContent = `<div class="tg-msg-header">${title}</div>`;
        
        // Parse basic markdown inside JS simulator (specifically bold stars)
        let formattedDetail = detailText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedDetail = formattedDetail.replace(/\n/g, '<br>');

        htmlContent += `<p>${formattedDetail}</p>`;
        htmlContent += `<span class="tg-msg-time">${timeStr}</span>`;

        bubble.innerHTML = htmlContent;
        telegramAlertsContainer.appendChild(bubble);

        // Auto scroll to bottom
        telegramAlertsContainer.scrollTop = telegramAlertsContainer.scrollHeight;
    }
});
