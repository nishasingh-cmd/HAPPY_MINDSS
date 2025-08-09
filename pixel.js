function scaleUp(element) {
    element.style.transform = "scale(1.2)";
    setTimeout(() => {
        element.style.transform = "scale(1)";
    }, 200);
}
// app.js - Enhanced Happy Minds Mental Health App
(function(){
  // DOM Elements
  const routes = document.querySelectorAll('[data-route]');
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav a');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  
  // Chatbot elements
  const chatToggle = document.getElementById('chat-toggle');
  const chatbot = document.getElementById('chatbot');
  const closeChat = document.getElementById('close-chat');
  const chatInput = document.getElementById('chat-input');
  const sendMessage = document.getElementById('send-message');
  const chatMessages = document.querySelector('.chatbot-messages');
  
  // Mood check-in elements
  const emojiBtns = document.querySelectorAll('.emoji-btn');
  const slider = document.getElementById('mood-slider');
  const factorTags = document.querySelectorAll('.factor-tag');
  const saveCheckinBtn = document.getElementById('save-checkin');
  const notes = document.getElementById('notes');
  
  // Journal elements
  const journalText = document.getElementById('journal-text');
  const journalList = document.querySelector('.entries-container');
  const saveJournalBtn = document.getElementById('save-journal');
  const clearJournalBtn = document.getElementById('clear-journal');
  const voiceJournalBtn = document.getElementById('voice-journal');
  const promptBtns = document.querySelectorAll('.prompt-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  // Music player elements
  const playPauseBtn = document.getElementById('play-pause');
  const prevTrackBtn = document.getElementById('prev-track');
  const nextTrackBtn = document.getElementById('next-track');
  const shufflePlayBtn = document.getElementById('shuffle-play');
  const addSongBtn = document.getElementById('add-song');
  const playlist = document.getElementById('playlist');
  const currentTrack = document.getElementById('current-track');
  const currentArtist = document.getElementById('current-artist');
  const progressBar = document.getElementById('progress-bar');
  const addSongModal = document.querySelector('.add-song-modal');
  const cancelAddBtn = document.getElementById('cancel-add');
  const confirmAddBtn = document.getElementById('confirm-add');
  
  // Resources elements
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const newQuoteBtn = document.getElementById('new-quote');
  const exerciseCards = document.querySelectorAll('.exercise-card');
  const danceCards = document.querySelectorAll('.video-card');
  
  // Reports elements
  const exportReportBtn = document.getElementById('export-report');
  const printReportBtn = document.getElementById('print-report');
  
  // Panic modal elements
  const panicBtn = document.getElementById('panic-btn');
  const panicModal = document.getElementById('panic-modal');
  const closePanic = document.getElementById('close-panic');
  const breathingCircle = document.querySelector('.breathing-circle');
  const breathText = document.querySelector('.breath-text');
  const timer = document.querySelector('.timer');
  
  // Video modal elements
  const videoModal = document.getElementById('video-modal');
  const closeVideo = document.getElementById('close-video');
  const youtubePlayer = document.getElementById('youtube-player');
  
  // Quick action buttons
  const actionBtns = document.querySelectorAll('.action-btn');
  
  // App state
  let selectedMood = 3;
  let selectedFactors = [];
  let currentAudio = null;
  let currentTrackIndex = -1;
  let isPlaying = false;
  let progressInterval;
  let breathInterval;
  let recognition;
  let isBreathing = false;
  let breathPhase = 0;
  let breathSeconds = 0;
  
  // Initialize the app
  function init() {
    // Routing
    setupRouting();
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Mood check-in
    setupMoodCheckin();
    
    // Journal
    setupJournal();
    
    // Music player
    setupMusicPlayer();
    
    // Resources
    setupResources();
    
    // Reports
    setupReports();
    
    // Panic/emergency
    setupPanicModal();
    
    // Video modal
    setupVideoModal();
    
    // Quick actions
    setupQuickActions();
    
    // Chatbot
    setupChatbot();
    
    // Load initial data
    loadInitialData();
    
    // Set today's quote
    setDailyQuote();
    
    // Initialize charts
    updateCharts();
  }
  
  // Routing functionality
  function setupRouting() {
    function goTo(route) {
      pages.forEach(p => p.classList.remove('active'));
      document.getElementById(route).classList.add('active');
      navLinks.forEach(a => a.classList.toggle('active', a.dataset.route === route));
      
      // Special case for reports - update charts when visited
      if (route === 'reports') {
        updateCharts();
      }
    }
    
    routes.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const r = link.dataset.route;
        goTo(r);
        history.pushState({ route: r }, '', `#${r}`);
        
        // Close mobile menu if open
        nav.classList.remove('active');
      });
    });
    
    // Initial route from hash
    const initial = location.hash ? location.hash.replace('#', '') : 'home';
    goTo(initial);
    
    // Hero CTA buttons
    document.getElementById('start-checkin').addEventListener('click', () => goTo('checkin'));
    document.getElementById('open-journal').addEventListener('click', () => goTo('journal'));
    
    // Back/forward navigation
    window.addEventListener('popstate', (e) => {
      const route = (e.state && e.state.route) || (location.hash ? location.hash.replace('#', '') : 'home');
      goTo(route);
    });
  }
  
  // Mobile menu toggle
  function toggleMobileMenu() {
    nav.classList.toggle('active');
  }
  
  // Mood check-in functionality
  function setupMoodCheckin() {
    function setMood(value) {
      selectedMood = value;
      slider.value = value;
      emojiBtns.forEach(b => b.classList.toggle('active', Number(b.dataset.value) === Number(value)));
    }
    
    emojiBtns.forEach(b => {
      b.addEventListener('click', () => setMood(Number(b.dataset.value)));
    });
    
    slider.addEventListener('input', (e) => {
      setMood(Number(e.target.value));
    });
    
    // Mood factors
    factorTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const factor = tag.dataset.factor;
        tag.classList.toggle('selected');
        
        if (tag.classList.contains('selected')) {
          selectedFactors.push(factor);
        } else {
          selectedFactors = selectedFactors.filter(f => f !== factor);
        }
      });
    });
    
    // Save check-in
    saveCheckinBtn.addEventListener('click', saveCheckin);
    
    // Panic button
    panicBtn.addEventListener('click', () => {
      panicModal.classList.remove('hidden');
      startBreathingExercise();
    });
    
    closePanic.addEventListener('click', () => {
      panicModal.classList.add('hidden');
      stopBreathingExercise();
    });
  }
  
  // Save check-in to localStorage
  function saveCheckin() {
    const note = notes.value;
    const factors = selectedFactors.join(', ');
    
    const checkins = JSON.parse(localStorage.getItem('hm_checkins') || []);
    const entry = {
      mood: selectedMood,
      note: note,
      factors: factors,
      time: new Date().toISOString()
    };
    
    checkins.push(entry);
    localStorage.setItem('hm_checkins', JSON.stringify(checkins));
    
    // Reset form
    notes.value = '';
    selectedFactors = [];
    factorTags.forEach(tag => tag.classList.remove('selected'));
    
    // Show confirmation
    showNotification('Check-in saved successfully! 🌼');
    
    // Update charts if on reports page
    if (document.getElementById('reports').classList.contains('active')) {
      updateCharts();
    }
  }
  
  // Journal functionality
  function setupJournal() {
    // Save journal entry
    saveJournalBtn.addEventListener('click', saveJournalEntry);
    
    // Clear journal
    clearJournalBtn.addEventListener('click', () => {
      journalText.value = '';
    });
    
    // Voice journal
    voiceJournalBtn.addEventListener('click', toggleVoiceJournal);
    
    // Journal prompts
    promptBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        journalText.value = btn.textContent + ' ';
        journalText.focus();
      });
    });
    
    // Journal filters
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderJournalEntries(btn.dataset.filter);
      });
    });
    
    // Render initial journal entries
    renderJournalEntries('all');
  }
  
  // Save journal entry
  function saveJournalEntry() {
    const text = journalText.value.trim();
    if (!text) return;
    
    const entries = JSON.parse(localStorage.getItem('hm_journal') || '[]');
    entries.push({
      text: text,
      time: new Date().toISOString()
    });
    
    localStorage.setItem('hm_journal', JSON.stringify(entries));
    journalText.value = '';
    renderJournalEntries('all');
    showNotification('Journal entry saved! 📖');
  }
  
  // Render journal entries with filter
  function renderJournalEntries(filter) {
    const entries = JSON.parse(localStorage.getItem('hm_journal') || []);
    const now = new Date();
    
    let filteredEntries = entries;
    
    if (filter === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredEntries = entries.filter(entry => new Date(entry.time) >= oneWeekAgo);
    } else if (filter === 'month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredEntries = entries.filter(entry => new Date(entry.time) >= oneMonthAgo);
    }
    
    journalList.innerHTML = '';
    
    if (filteredEntries.length === 0) {
      journalList.innerHTML = '<p class="empty-message">No entries found. Start writing to see your journal history here.</p>';
      return;
    }
    
    filteredEntries.reverse().forEach(entry => {
      const entryDiv = document.createElement('div');
      entryDiv.className = 'journal-entry';
      
      const date = new Date(entry.time);
      const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      entryDiv.innerHTML = `
        <div class="journal-meta">
          <i class="far fa-calendar-alt"></i> ${dateStr}
        </div>
        <div class="journal-content">${escapeHtml(entry.text)}</div>
      `;
      
      journalList.appendChild(entryDiv);
    });
  }
  
  // Voice journal functionality
  function toggleVoiceJournal() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showNotification('Voice input is not supported in your browser 😢', 'error');
      return;
    }
    
    if (voiceJournalBtn.classList.contains('recording')) {
      // Stop recording
      recognition.stop();
      voiceJournalBtn.classList.remove('recording');
      voiceJournalBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Note';
      showNotification('Voice recording stopped');
    } else {
      // Start recording
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        voiceJournalBtn.classList.add('recording');
        voiceJournalBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Stop Recording';
        showNotification('Listening... Speak now');
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        journalText.value += transcript + ' ';
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        voiceJournalBtn.classList.remove('recording');
        voiceJournalBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Note';
        showNotification('Voice input error: ' + event.error, 'error');
      };
      
      recognition.onend = () => {
        if (voiceJournalBtn.classList.contains('recording')) {
          recognition.start(); // Continue listening
        } else {
          voiceJournalBtn.innerHTML = '<i class="fas fa-microphone"></i> Voice Note';
        }
      };
      
      recognition.start();
    }
  }
  
  // Music player functionality
  function setupMusicPlayer() {
    // Load playlist from localStorage
    loadPlaylist();
    
    // Player controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevTrackBtn.addEventListener('click', playPreviousTrack);
    nextTrackBtn.addEventListener('click', playNextTrack);
    shufflePlayBtn.addEventListener('click', playRandomTrack);
    
    // Add song modal
    addSongBtn.addEventListener('click', () => {
      addSongModal.classList.remove('hidden');
    });
    
    cancelAddBtn.addEventListener('click', () => {
      addSongModal.classList.add('hidden');
      clearAddSongForm();
    });
    
    confirmAddBtn.addEventListener('click', addNewSong);
    
    // Progress bar click
    document.querySelector('.progress-container').addEventListener('click', (e) => {
      if (!currentAudio) return;
      
      const containerWidth = document.querySelector('.progress-container').clientWidth;
      const clickPosition = e.offsetX;
      const percentage = clickPosition / containerWidth;
      currentAudio.currentTime = percentage * currentAudio.duration;
    });
    
    // Update progress bar periodically
    setInterval(updateProgressBar, 500);
  }
  
  // Load playlist from localStorage
  function loadPlaylist() {
    const songs = JSON.parse(localStorage.getItem('hm_playlist') || '[]');
    playlist.innerHTML = '';
    
    if (songs.length === 0) {
      playlist.innerHTML = '<p class="empty-message">Your playlist is empty. Add some songs to get started!</p>';
      return;
    }
    
    songs.forEach((song, index) => {
      const songElement = document.createElement('div');
      songElement.className = 'playlist-item';
      songElement.dataset.index = index;
      
      songElement.innerHTML = `
        <div class="song-info">
          <div class="song-title">${escapeHtml(song.title)}</div>
          <div class="song-artist">${escapeHtml(song.artist)}</div>
        </div>
        <button class="remove-song"><i class="fas fa-times"></i></button>
      `;
      
      songElement.addEventListener('click', (e) => {
        if (!e.target.classList.contains('remove-song') && !e.target.closest('.remove-song')) {
          playTrack(index);
        }
      });
      
      const removeBtn = songElement.querySelector('.remove-song');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeSong(index);
      });
      
      playlist.appendChild(songElement);
    });
  }
  
  // Add new song to playlist
  function addNewSong() {
    const title = document.getElementById('song-title').value.trim();
    const artist = document.getElementById('song-artist').value.trim();
    const url = document.getElementById('song-url').value.trim();
    
    if (!title || !artist) {
      showNotification('Please enter both song title and artist', 'error');
      return;
    }
    
    const songs = JSON.parse(localStorage.getItem('hm_playlist') || '[]');
    songs.push({ title, artist, url });
    localStorage.setItem('hm_playlist', JSON.stringify(songs));
    
    loadPlaylist();
    clearAddSongForm();
    addSongModal.classList.add('hidden');
    showNotification('Song added to playlist! 🎵');
    
    // If this is the first song, play it automatically
    if (songs.length === 1) {
      playTrack(0);
    }
  }
  
  // Clear add song form
  function clearAddSongForm() {
    document.getElementById('song-title').value = '';
    document.getElementById('song-artist').value = '';
    document.getElementById('song-url').value = '';
  }
  
  // Remove song from playlist
  function removeSong(index) {
    const songs = JSON.parse(localStorage.getItem('hm_playlist') || []);
    songs.splice(index, 1);
    localStorage.setItem('hm_playlist', JSON.stringify(songs));
    loadPlaylist();
    
    // If we removed the currently playing song, stop playback
    if (currentTrackIndex === index) {
      stopPlayback();
    } else if (currentTrackIndex > index) {
      currentTrackIndex--;
    }
  }
  
  // Play a specific track
  function playTrack(index) {
    const songs = JSON.parse(localStorage.getItem('hm_playlist') || "[]");
    
    if (index < 0 || index >= songs.length) {
      return;
    }
    
    const song = songs[index];
    currentTrackIndex = index;
    
    // Update UI
    currentTrack.textContent = song.title;
    currentArtist.textContent = song.artist;
    
    // Highlight current track in playlist
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    
    // If there's a URL, try to play it (this is simplified - in a real app you'd use a proper audio API)
    if (song.url) {
      stopPlayback();
      
      // This is a simplified approach - in a real app you'd use the YouTube API or similar
      // For demo purposes, we'll just simulate playback
      currentAudio = {
        play: () => {
          isPlaying = true;
          updatePlayPauseButton();
          showNotification(`Now playing: ${song.title} by ${song.artist}`);
        },
        pause: () => {
          isPlaying = false;
          updatePlayPauseButton();
        },
        currentTime: 0,
        duration: 180 // 3 minutes for demo
      };
      
      currentAudio.play();
    } else {
      showNotification(`Selected: ${song.title} by ${song.artist} (no audio URL provided)`);
    }
  }
  
  // Toggle play/pause
  function togglePlayPause() {
    if (!currentAudio) {
      if (playlist.children.length > 0) {
        playTrack(0);
      }
      return;
    }
    
    if (isPlaying) {
      currentAudio.pause();
    } else {
      currentAudio.play();
    }
  }
  
  // Play previous track
  function playPreviousTrack() {
    if (currentTrackIndex <= 0) return;
    playTrack(currentTrackIndex - 1);
  }
  
  // Play next track
  function playNextTrack() {
    const songs = JSON.parse(localStorage.getItem('hm_playlist') || []);
    if (currentTrackIndex >= songs.length - 1) return;
    playTrack(currentTrackIndex + 1);
  }
  
  // Play random track
  function playRandomTrack() {
    const songs = JSON.parse(localStorage.getItem('hm_playlist') || []);
    if (songs.length === 0) return;
    
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentTrackIndex && songs.length > 1);
    
    playTrack(randomIndex);
  }
  
  // Stop playback
  function stopPlayback() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    isPlaying = false;
    updatePlayPauseButton();
  }
  
  // Update play/pause button
  function updatePlayPauseButton() {
    if (isPlaying) {
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  }
  
  // Update progress bar
  function updateProgressBar() {
    if (!currentAudio || !isPlaying) return;
    
    // For demo, we'll simulate progress
    if (!currentAudio.currentTime) currentAudio.currentTime = 0;
    currentAudio.currentTime += 0.5;
    
    if (currentAudio.currentTime >= currentAudio.duration) {
      playNextTrack();
      return;
    }
    
    const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }
  
  // Resources functionality
  function setupResources() {
    // Daily quote
    newQuoteBtn.addEventListener('click', setDailyQuote);
    
    // Breathing exercises
    exerciseCards.forEach(card => {
      card.addEventListener('click', () => {
        const technique = card.dataset.technique;
        startBreathingExercise(technique);
        panicModal.classList.remove('hidden');
      });
    });
    
    // Dance therapy videos
    danceCards.forEach(card => {
      card.addEventListener('click', () => {
        const videoId = card.dataset.video;
        showVideoModal(videoId);
      });
    });
  }
  
  // Set daily quote
  function setDailyQuote() {
    const quotes = [
      {
        text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
        author: "A.A. Milne"
      },
      {
        text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
        author: "Noam Shpancer"
      },
      {
        text: "Self-care is how you take your power back.",
        author: "Lalah Delia"
      },
      {
        text: "It's okay to not be okay. It's okay to ask for help. It's okay to take time for yourself.",
        author: "Unknown"
      },
      {
        text: "Healing takes time, and asking for help is a courageous step.",
        author: "Mariska Hargitay"
      },
      {
        text: "You don't have to control your thoughts. You just have to stop letting them control you.",
        author: "Dan Millman"
      },
      {
        text: "The only journey is the journey within.",
        author: "Rainer Maria Rilke"
      },
      {
        text: "You, yourself, as much as anybody in the entire universe, deserve your love and affection.",
        author: "Buddha"
      },
      {
        text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.",
        author: "Glenn Close"
      },
      {
        text: "Progress is progress, no matter how small.",
        author: "Unknown"
      }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `— ${randomQuote.author}`;
  }
  
  // Reports functionality
  function setupReports() {
    // Export report
    exportReportBtn.addEventListener('click', exportReport);
    
    // Print report
    printReportBtn.addEventListener('click', () => {
      window.print();
    });
  }
  
  // Update charts
  function updateCharts() {
    updateMoodChart();
    updateFactorsChart();
    updateJournalInsights();
    updateActivityStats();
  }
  
  // Update mood chart
  function updateMoodChart() {
    const ctx = document.getElementById('moodChart').getContext('2d');
    const moodData = getWeeklyMoodData();

   if (window.moodChart && typeof window.moodChart.destroy === "function") {
  window.moodChart.destroy();
}

    
    window.moodChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: moodData.labels,
        datasets: [{
          label: 'Mood (1-5)',
          data: moodData.data,
          fill: true,
          tension: 0.3,
          pointRadius: 6,
          backgroundColor: 'rgba(255, 120, 160, 0.12)',
          borderColor: '#ff4b8b'
        }]
      },
      options: {
        scales: {
          y: {
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Mood: ${context.parsed.y}`;
              }
            }
          }
        }
      }
    });
  }
  
  // Update factors chart
  function updateFactorsChart() {
    const ctx = document.getElementById('factorsChart').getContext('2d');
    const factorsData = getFactorsData();
    
if (window.factorsChart && typeof window.factorsChart.destroy === "function") {
  window.factorsChart.destroy();
}
    
    window.factorsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: factorsData.labels,
        datasets: [{
          label: 'Mood Factors',
          data: factorsData.data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  
  // Get weekly mood data
  function getWeeklyMoodData() {
    const checkins = JSON.parse(localStorage.getItem('hm_checkins') || []);
    const days = [];
    
    // Create 7-day buckets (today and previous 6 days)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    
    const labels = days.map(d => new Date(d).toLocaleDateString(undefined, { weekday: 'short' }));
    const data = days.map(day => {
      const entries = checkins.filter(c => c.time.slice(0, 10) === day).map(x => x.mood);
      if (entries.length === 0) return null;
      const avg = entries.reduce((a, b) => a + b, 0) / entries.length;
      return Math.round(avg * 10) / 10;
    });
    
    return { labels, data };
  }
  
  // Get factors data
  function getFactorsData() {
    const checkins = JSON.parse(localStorage.getItem('hm_checkins') || []);
    const factors = {
      sleep: 0,
      work: 0,
      relationships: 0,
      health: 0,
      finance: 0,
      other: 0
    };
    
    checkins.forEach(checkin => {
      if (checkin.factors) {
        checkin.factors.split(', ').forEach(factor => {
          if (factors.hasOwnProperty(factor)) {
            factors[factor]++;
          }
        });
      }
    });
    
    return {
      labels: Object.keys(factors),
      data: Object.values(factors)
    };
  }
  
  // Update journal insights
  function updateJournalInsights() {
    const entries = JSON.parse(localStorage.getItem('hm_journal') || '[]');

    const wordCloud = document.querySelector('.word-cloud');
    const moodPatternText = document.getElementById('mood-pattern-text');
    
    // Word cloud (simplified)
    if (entries.length > 0) {
      // Extract words and count frequencies (simplified)
      const allText = entries.map(e => e.text).join(' ');
      const words = allText.toLowerCase().match(/\b(\w+)\b/g) || [];
      
      // Filter out common words
      const commonWords = ['the', 'and', 'i', 'to', 'a', 'of', 'my', 'me', 'in', 'is', 'it', 'that', 'was', 'for', 'on', 'with', 'he', 'she', 'they', 'we', 'you', 'your', 'at', 'be', 'this', 'have', 'from', 'or', 'an', 'by', 'not', 'but', 'what', 'all', 'are', 'as', 'if'];
      
      const wordCounts = {};
      words.forEach(word => {
        if (word.length > 3 && !commonWords.includes(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
      
      // Get top 20 words
      const sortedWords = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
      
      wordCloud.innerHTML = '';
      sortedWords.forEach(([word, count]) => {
        const size = 12 + (count * 2);
        const span = document.createElement('span');
        span.textContent = word;
        span.style.fontSize = `${size}px`;
        span.style.opacity = `${0.5 + (count / 10)}`;
        wordCloud.appendChild(span);
      });
    } else {
      wordCloud.innerHTML = '<p>No journal entries yet. Start writing to see your word cloud.</p>';
    }
    
    // Mood patterns (simplified analysis)
    if (entries.length >= 5) {
      moodPatternText.textContent = "Based on your journal entries, you tend to write more when you're feeling reflective or working through challenges. Keep journaling to uncover more patterns!";
    } else {
      moodPatternText.textContent = "Your mood patterns will appear here after several journal entries. Keep writing to uncover insights!";
    }
  }
  
  // Update activity stats
  function updateActivityStats() {
    const checkins = JSON.parse(localStorage.getItem('hm_checkins') || []);
    const journalEntries = JSON.parse(localStorage.getItem('hm_journal') || []);
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    // Check-ins this month
    const monthlyCheckins = checkins.filter(c => {
      const date = new Date(c.time);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });
    
    // Journal entries this month
    const monthlyJournal = journalEntries.filter(j => {
      const date = new Date(j.time);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });
    
    // Update stats
    document.getElementById('checkin-count').textContent = monthlyCheckins.length;
    document.getElementById('journal-count').textContent = monthlyJournal.length;
    document.getElementById('music-count').textContent = Math.floor(Math.random() * 20) + 5; // Demo data
    document.getElementById('breathing-count').textContent = Math.floor(Math.random() * 15) + 3; // Demo data
  }
  
  // Export report
  function exportReport() {
    // In a real app, this would generate a PDF or CSV
    // For demo, we'll just show a notification
    showNotification('Report exported successfully! You can now share it with your healthcare provider.', 'success');
  }
  
  // Panic modal functionality
  function setupPanicModal() {
    panicBtn.addEventListener('click', () => {
      panicModal.classList.remove('hidden');
      startBreathingExercise();
    });
    
    closePanic.addEventListener('click', () => {
      panicModal.classList.add('hidden');
      stopBreathingExercise();
    });
  }
  
  // Start breathing exercise
  function startBreathingExercise(technique = 'box') {
    if (isBreathing) return;
    
    isBreathing = true;
    let phases, durations;
    
    switch (technique) {
      case 'box':
        phases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
        durations = [4, 4, 4, 4];
        break;
      case '478':
        phases = ['Breathe In', 'Hold', 'Breathe Out'];
        durations = [4, 7, 8];
        break;
      case 'belly':
        phases = ['Breathe In', 'Breathe Out'];
        durations = [5, 5];
        break;
      default:
        phases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
        durations = [4, 4, 4, 4];
    }
    
    breathPhase = 0;
    breathSeconds = 0;
    
    updateBreathingUI(phases[0], durations[0]);
    
    breathInterval = setInterval(() => {
      breathSeconds++;
      
      // Update timer
      timer.textContent = durations[breathPhase] - breathSeconds;
      
      // Animate circle
      const progress = breathSeconds / durations[breathPhase];
      const scale = technique === 'belly' ? 
        (breathPhase === 0 ? 0.8 + progress * 0.4 : 1.2 - progress * 0.4) :
        (breathPhase === 0 ? 0.8 + progress * 0.4 : 
         breathPhase === 2 ? 1.2 - progress * 0.4 : 1.2);
      
      breathingCircle.style.transform = `scale(${scale})`;
      
      // Change phase when duration is complete
      if (breathSeconds >= durations[breathPhase]) {
        breathPhase = (breathPhase + 1) % phases.length;
        breathSeconds = 0;
        updateBreathingUI(phases[breathPhase], durations[breathPhase]);
      }
    }, 1000);
  }
  
  // Update breathing UI
  function updateBreathingUI(phase, duration) {
    breathText.textContent = phase;
    timer.textContent = duration;
    
    // Change circle color based on phase
    if (phase.includes('In')) {
      breathingCircle.style.background = 'radial-gradient(circle, var(--pink) 0%, var(--accent) 100%)';
    } else if (phase.includes('Out')) {
      breathingCircle.style.background = 'radial-gradient(circle, var(--accent) 0%, var(--pink) 100%)';
    } else {
      breathingCircle.style.background = 'radial-gradient(circle, #ffde59 0%, #ff7aa2 100%)';
    }
  }
  
  // Stop breathing exercise
  function stopBreathingExercise() {
    if (!isBreathing) return;
    
    clearInterval(breathInterval);
    isBreathing = false;
    breathingCircle.style.transform = 'scale(1)';
  }
  
  // Video modal functionality
  function setupVideoModal() {
    danceCards.forEach(card => {
      card.addEventListener('click', () => {
        const videoId = card.dataset.video;
        showVideoModal(videoId);
      });
    });
    
    closeVideo.addEventListener('click', () => {
      videoModal.classList.add('hidden');
      youtubePlayer.src = '';
    });
  }
  
  // Show video modal
  function showVideoModal(videoId) {
    youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    videoModal.classList.remove('hidden');
  }
  
  // Quick actions functionality
  function setupQuickActions() {
    actionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        
        switch (action) {
          case 'breathing':
            startBreathingExercise();
            panicModal.classList.remove('hidden');
            break;
          case 'dance':
            // Play a random dance video
            const danceVideos = ['dQw4w9WgXcQ', 'tAP0BLCDM7I', 'JQbjS0_ZfJ0'];
            const randomVideo = danceVideos[Math.floor(Math.random() * danceVideos.length)];
            showVideoModal(randomVideo);
            break;
          case 'quote':
            setDailyQuote();
            showNotification('Here\'s a new quote for you!');
            break;
          case 'music':
            goTo('music');
            playRandomTrack();
            break;
        }
      });
    });
  }
  
  // Chatbot functionality
  function setupChatbot() {
    chatToggle.addEventListener('click', () => {
      chatbot.classList.toggle('hidden');
      if (!chatbot.classList.contains('hidden')) {
        chatbot.style.transform = 'translateY(0)';
        chatbot.style.opacity = '1';
        chatInput.focus();
      }
    });
    
    closeChat.addEventListener('click', () => {
      chatbot.classList.add('hidden');
    });
    
    sendMessage.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
    
    // Quick replies
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-reply')) {
        e.preventDefault();
        addMessage(e.target.textContent, 'user');
        processUserMessage(e.target.textContent);
      }
    });
  }
  
  // Send chat message
  function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    chatInput.value = '';
    processUserMessage(message);
  }
  
  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    if (sender === 'bot') {
      messageDiv.innerHTML = `
        <div class="message-avatar">M</div>
        <div class="message-content">
          <p>${text}</p>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-content user-message">
          <p>${text}</p>
        </div>
      `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Process user message and generate bot response
  function processUserMessage(message) {
    // Simple AI responses based on keywords
    let response = '';
    const lowerMsg = message.toLowerCase();
    
    // Simulate typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message bot-message typing';
    typingIndicator.innerHTML = `
      <div class="message-avatar">M</div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Remove typing indicator after delay
    setTimeout(() => {
      typingIndicator.remove();
      
      if (lowerMsg.includes('anxious') || lowerMsg.includes('stress') || lowerMsg.includes('worr')) {
        response = "I hear that you're feeling anxious. That's completely normal. Would you like to try a breathing exercise or listen to some calming music?";
        
        // Add quick replies
        const quickReplies = `
          <div class="quick-replies">
            <button class="quick-reply">Yes, breathing exercise</button>
            <button class="quick-reply">Play calming music</button>
            <button class="quick-reply">I just need to talk</button>
          </div>
        `;
        addMessage(response + quickReplies, 'bot');
      } 
      else if (lowerMsg.includes('sad') || lowerMsg.includes('depress') || lowerMsg.includes('down')) {
        response = "I'm sorry you're feeling this way. Remember that feelings are temporary, and it's okay to not be okay. Would you like to journal about it or try a mood-boosting activity?";
        
        const quickReplies = `
          <div class="quick-replies">
            <button class="quick-reply">Journal</button>
            <button class="quick-reply">Mood-boosting activity</button>
            <button class="quick-reply">I need more help</button>
          </div>
        `;
        addMessage(response + quickReplies, 'bot');
      }
      else if (lowerMsg.includes('happy') || lowerMsg.includes('good') || lowerMsg.includes('great')) {
        response = "That's wonderful to hear! 😊 Celebrating the good moments is just as important as working through the tough ones. Would you like to save this moment in your journal?";
        
        const quickReplies = `
          <div class="quick-replies">
            <button class="quick-reply">Yes, save to journal</button>
            <button class="quick-reply">Suggest a happy activity</button>
          </div>
        `;
        addMessage(response + quickReplies, 'bot');
      }
      else if (lowerMsg.includes('help') || lowerMsg.includes('emergency')) {
        response = "If you're in immediate distress, please consider reaching out to a professional. Here are some resources you can access right now:";
        
        const quickReplies = `
          <div class="quick-replies">
            <button class="quick-reply">Show emergency contacts</button>
            <button class="quick-reply">I need calming exercises</button>
          </div>
        `;
        addMessage(response + quickReplies, 'bot');
      }
      else {
        // Default empathetic response
        const randomResponses = [
          "I'm here to listen. Can you tell me more about how you're feeling?",
          "Thank you for sharing that with me. How can I support you right now?",
          "I hear you. Remember that your feelings are valid. Would you like to explore this further?",
          "That sounds challenging. Would you like to try a coping strategy or just talk it through?"
        ];
        response = randomResponses[Math.floor(Math.random() * randomResponses.length)];
        
        const quickReplies = `
          <div class="quick-replies">
            <button class="quick-reply">Coping strategy</button>
            <button class="quick-reply">Just talk</button>
            <button class="quick-reply">I'm feeling better now</button>
          </div>
        `;
        addMessage(response + quickReplies, 'bot');
      }
    }, 1000 + Math.random() * 2000); // Random delay to simulate typing
  }
  
  // Load initial data
  function loadInitialData() {
    // Seed demo data if empty
    if (!localStorage.getItem('hm_checkins')) {
      const demoCheckins = [];
      const today = new Date();
      
      for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        
        const moods = [1, 2, 3, 4, 5];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        
        const factors = ['sleep', 'work', 'relationships', 'health', 'finance', 'other'];
        const randomFactors = [];
        for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
          const randomFactor = factors[Math.floor(Math.random() * factors.length)];
          if (!randomFactors.includes(randomFactor)) {
            randomFactors.push(randomFactor);
          }
        }
        
        demoCheckins.push({
          mood: randomMood,
          note: i % 3 === 0 ? 'Had a good day today' : 
                i % 3 === 1 ? 'Feeling a bit tired' : 'Struggling with work',
          factors: randomFactors.join(', '),
          time: d.toISOString()
        });
      }
      
      localStorage.setItem('hm_checkins', JSON.stringify(demoCheckins));
    }
    
    // Seed demo journal entries if empty
    if (!localStorage.getItem('hm_journal')) {
      const demoJournal = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        
        const prompts = [
          "Today I felt...",
          "Something that made me smile was...",
          "I'm struggling with...",
          "I'm grateful for...",
          "A challenge I faced today was..."
        ];
        
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        const randomContent = `${randomPrompt} ${i % 2 === 0 ? 'I had a productive day at work and felt accomplished.' : 'I felt overwhelmed by my responsibilities but managed to get through it.'}`;
        
        demoJournal.push({
          text: randomContent,
          time: d.toISOString()
        });
      }
      
      localStorage.setItem('hm_journal', JSON.stringify(demoJournal));
    }
    
    // Seed demo playlist if empty
    if (!localStorage.getItem('hm_playlist')) {
      const demoPlaylist = [
        {
          title: "Calming Piano",
          artist: "Relaxation Music",
          url: "https://www.youtube.com/watch?v=abcdefg"
        },
        {
          title: "Morning Energy",
          artist: "Upbeat Mix",
          url: "https://www.youtube.com/watch?v=hijklmn"
        },
        {
          title: "Focus Flow",
          artist: "Concentration Music",
          url: "https://www.youtube.com/watch?v=opqrst"
        }
      ];
      
      localStorage.setItem('hm_playlist', JSON.stringify(demoPlaylist));
    }
  }
  
  // Show notification
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }
  // ...existing code...
function safeParse(json, fallback) {
  try {
    if (!json || json === "null" || json === "") return fallback;
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
// ...existing code...
function renderJournalEntries(filter) {
  const raw = localStorage.getItem('hm_journal');
  const entries = safeParse(raw, []);
  // ...rest of your code...
}
// ...existing code...
  
  // Escape HTML helper
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function(m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[m];
    });
  }
  
  // Initialize the app
  init();
})();