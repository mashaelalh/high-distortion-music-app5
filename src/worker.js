/**
 * High Distortion Music App
 * A beautiful music streaming interface built for Cloudflare Workers
 * 
 * Features:
 * - Responsive design with modern dark theme
 * - Interactive music player with simulated playback
 * - Complete design system implementation
 * - Smooth animations and transitions
 * - Search functionality
 * - Global edge deployment via Cloudflare
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Get URL path for potential routing
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle API endpoints (future expansion)
    if (path.startsWith('/api/')) {
      return handleAPI(request, env);
    }

    // Serve the main application
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>High Distortion - Music Streaming</title>
    <meta name="description" content="High Distortion playlist featuring the best of alternative and indie rock music">
    <meta name="keywords" content="music, streaming, playlist, alternative, indie, rock">
    <meta name="author" content="High Distortion Music App">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${request.url}">
    <meta property="og:title" content="High Distortion - Music Streaming">
    <meta property="og:description" content="Curated playlist featuring the best of alternative and indie rock">
    <meta property="og:image" content="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${request.url}">
    <meta property="twitter:title" content="High Distortion - Music Streaming">
    <meta property="twitter:description" content="Curated playlist featuring the best of alternative and indie rock">
    <meta property="twitter:image" content="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎵</text></svg>">
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            /* Colors from Design System */
            --color-brand-primary: #FF2763;
            --color-brand-primary-hover: #E02057;
            --color-brand-primary-active: #C81C50;
            --color-bg-page: #0B0F1C;
            --color-bg-sidebar: #0E121F;
            --color-bg-card: #10141E;
            --color-bg-gradient-start: #652E5E;
            --color-bg-gradient-end: #301E35;
            --color-text-primary: #FFFFFF;
            --color-text-secondary: #C5C5D2;
            --color-text-tertiary: #8E8E9A;
            --color-text-inverse: #0B0F1C;
            --color-text-on-brand: #FFFFFF;
            --color-border-strong: rgba(255,255,255,0.08);
            --color-border-subtle: rgba(255,255,255,0.04);
            --color-state-success: #28C972;
            
            /* Typography */
            --font-family: 'Inter', 'Roboto', 'Segoe UI', sans-serif;
            
            /* Spacing */
            --spacing-xxs: 4px;
            --spacing-xs: 8px;
            --spacing-sm: 12px;
            --spacing-md: 16px;
            --spacing-lg: 24px;
            --spacing-xl: 32px;
            --spacing-2xl: 48px;
            --spacing-3xl: 64px;
            
            /* Layout */
            --sidebar-width: 240px;
            --player-height: 72px;
            --page-margin: 48px;
            
            /* Shadows */
            --shadow-card: 0 2px 8px 0 rgba(0,0,0,0.35);
            --shadow-dialog: 0 24px 64px -8px rgba(0,0,0,0.55);
        }

        body {
            font-family: var(--font-family);
            background: var(--color-bg-page);
            color: var(--color-text-primary);
            overflow-x: hidden;
        }

        .app-layout {
            display: grid;
            grid-template-columns: var(--sidebar-width) 1fr;
            grid-template-rows: 1fr var(--player-height);
            height: 100vh;
            gap: 0;
        }

        /* Sidebar */
        .sidebar {
            background: var(--color-bg-sidebar);
            grid-row: 1 / 3;
            padding: var(--spacing-lg);
            overflow-y: auto;
        }

        .logo {
            font-size: 24px;
            font-weight: 700;
            color: var(--color-brand-primary);
            margin-bottom: var(--spacing-xl);
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
        }

        .nav-section {
            margin-bottom: var(--spacing-xl);
        }

        .nav-title {
            font-size: 12px;
            font-weight: 400;
            color: var(--color-text-tertiary);
            text-transform: uppercase;
            letter-spacing: 0.2px;
            margin-bottom: var(--spacing-md);
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-sm) var(--spacing-lg);
            margin: 0 calc(-1 * var(--spacing-lg));
            border-radius: 8px;
            color: var(--color-text-secondary);
            text-decoration: none;
            font-size: 14px;
            font-weight: 400;
            transition: all 0.2s ease;
            position: relative;
        }

        .nav-item:hover {
            background: rgba(255,255,255,0.04);
            color: var(--color-text-primary);
        }

        .nav-item.active {
            color: var(--color-text-primary);
            background: rgba(255,255,255,0.06);
        }

        .nav-item.active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--color-brand-primary);
        }

        .nav-item i {
            width: 20px;
            font-size: 20px;
        }

        .playlist-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-xs) var(--spacing-lg);
            margin: 0 calc(-1 * var(--spacing-lg));
            color: var(--color-text-secondary);
            text-decoration: none;
            font-size: 14px;
            transition: all 0.2s ease;
            position: relative;
        }

        .playlist-item:hover {
            color: var(--color-text-primary);
        }

        .playlist-item.active {
            color: var(--color-text-primary);
        }

        .playlist-item.active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: var(--color-brand-primary);
        }

        .playlist-badge {
            background: var(--color-brand-primary);
            color: var(--color-text-on-brand);
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 9999px;
            margin-left: auto;
        }

        /* Main Content */
        .main-content {
            background: var(--color-bg-page);
            padding: var(--spacing-lg);
            overflow-y: auto;
            position: relative;
        }

        .main-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--spacing-xl);
        }

        .search-container {
            position: relative;
            flex: 1;
            max-width: 400px;
        }

        .search-bar {
            width: 100%;
            height: 40px;
            background: var(--color-bg-card);
            border: none;
            border-radius: 9999px;
            padding: 0 20px 0 48px;
            color: var(--color-text-primary);
            font-size: 16px;
            outline: none;
            transition: all 0.2s ease;
        }

        .search-bar::placeholder {
            color: var(--color-text-tertiary);
        }

        .search-bar:focus {
            box-shadow: 0 0 0 2px rgba(46,168,255,0.55);
        }

        .search-icon {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-text-tertiary);
        }

        .user-controls {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
        }

        .avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.1);
            object-fit: cover;
        }

        /* Hero Section */
        .hero-section {
            background: linear-gradient(135deg, var(--color-bg-gradient-start), var(--color-bg-gradient-end));
            padding: var(--spacing-3xl) var(--spacing-2xl);
            border-radius: 12px;
            margin-bottom: var(--spacing-xl);
            position: relative;
            overflow: hidden;
        }

        .hero-content h1 {
            font-size: 56px;
            font-weight: 700;
            line-height: 1.1;
            letter-spacing: -1px;
            margin-bottom: var(--spacing-md);
        }

        .hero-content p {
            font-size: 18px;
            font-weight: 600;
            line-height: 1.35;
            color: var(--color-text-secondary);
            margin-bottom: var(--spacing-xl);
        }

        .hero-stats {
            display: flex;
            gap: var(--spacing-xl);
            margin-bottom: var(--spacing-xl);
        }

        .stat-item span {
            display: block;
            font-size: 24px;
            font-weight: 700;
            color: var(--color-text-primary);
        }

        .stat-item small {
            font-size: 12px;
            color: var(--color-text-tertiary);
            text-transform: uppercase;
            letter-spacing: 0.2px;
        }

        .hero-actions {
            display: flex;
            gap: var(--spacing-md);
            align-items: center;
        }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-xs);
            border: none;
            border-radius: 9999px;
            font-family: inherit;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: var(--shadow-card);
        }

        .btn-primary {
            height: 48px;
            padding: 0 24px;
            background: var(--color-brand-primary);
            color: var(--color-text-on-brand);
            font-size: 18px;
        }

        .btn-primary:hover {
            background: var(--color-brand-primary-hover);
            transform: translateY(-1px);
        }

        .btn-primary:active {
            background: var(--color-brand-primary-active);
            transform: translateY(0);
        }

        .btn-icon {
            width: 48px;
            height: 48px;
            background: var(--color-bg-card);
            color: var(--color-text-primary);
            border-radius: 50%;
        }

        .btn-icon:hover {
            background: rgba(255,255,255,0.06);
        }

        /* Content Sections */
        .content-section {
            margin-bottom: var(--spacing-2xl);
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--spacing-lg);
        }

        .section-title {
            font-size: 24px;
            font-weight: 700;
            line-height: 1.2;
        }

        .section-link {
            color: var(--color-text-secondary);
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            transition: color 0.2s ease;
        }

        .section-link:hover {
            color: var(--color-text-primary);
        }

        /* Album Grid */
        .album-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: var(--spacing-lg);
        }

        .album-card {
            background: var(--color-bg-card);
            padding: var(--spacing-md);
            border-radius: 8px;
            box-shadow: var(--shadow-card);
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .album-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-dialog);
        }

        .album-cover {
            width: 96px;
            height: 96px;
            border-radius: 4px;
            object-fit: cover;
            margin-bottom: var(--spacing-xs);
        }

        .album-title {
            font-size: 12px;
            font-weight: 400;
            line-height: 1.4;
            letter-spacing: 0.2px;
            margin-bottom: 2px;
            color: var(--color-text-primary);
        }

        .album-artist {
            font-size: 12px;
            font-weight: 400;
            line-height: 1.4;
            letter-spacing: 0.2px;
            color: var(--color-text-tertiary);
        }

        /* Song List */
        .song-list {
            background: var(--color-bg-card);
            border-radius: 12px;
            overflow: hidden;
        }

        .song-item {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            height: 44px;
            padding: 0 var(--spacing-lg);
            font-size: 14px;
            color: var(--color-text-secondary);
            transition: background-color 0.2s ease;
            cursor: pointer;
            border-bottom: 1px solid var(--color-border-subtle);
        }

        .song-item:last-child {
            border-bottom: none;
        }

        .song-item:hover {
            background: rgba(255,255,255,0.04);
            color: var(--color-text-primary);
        }

        .song-item.active {
            background: rgba(255,255,255,0.08);
            color: var(--color-text-primary);
        }

        .song-number {
            width: 20px;
            text-align: center;
            color: var(--color-text-tertiary);
        }

        .song-info {
            flex: 1;
            min-width: 0;
        }

        .song-title {
            color: var(--color-text-primary);
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .song-artist {
            font-size: 12px;
            color: var(--color-text-tertiary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .song-duration {
            color: var(--color-text-tertiary);
            font-size: 12px;
        }

        /* Bottom Player */
        .bottom-player {
            background: var(--color-bg-card);
            display: flex;
            align-items: center;
            padding: 0 var(--spacing-lg);
            gap: var(--spacing-md);
            box-shadow: var(--shadow-dialog);
            grid-column: 1 / 3;
        }

        .player-track {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            width: 300px;
        }

        .player-thumbnail {
            width: 40px;
            height: 40px;
            border-radius: 4px;
            object-fit: cover;
        }

        .player-info .track-title {
            font-size: 14px;
            color: var(--color-text-primary);
            margin-bottom: 2px;
        }

        .player-info .track-artist {
            font-size: 12px;
            color: var(--color-text-tertiary);
        }

        .player-controls {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            flex: 1;
            justify-content: center;
        }

        .control-btn {
            background: none;
            border: none;
            color: var(--color-text-secondary);
            cursor: pointer;
            padding: var(--spacing-xs);
            border-radius: 50%;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .control-btn:hover {
            color: var(--color-text-primary);
            background: rgba(255,255,255,0.1);
        }

        .control-btn.play-pause {
            background: #2763ff;
            color: var(--color-text-on-brand);
            width: 32px;
            height: 32px;
        }

        .control-btn.play-pause:hover {
            background: var(--color-brand-primary-hover);
        }

        .player-extras {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            width: 200px;
            justify-content: flex-end;
        }

        .volume-control {
            display: flex;
            align-items: center;
            gap: var(--spacing-xs);
        }

        .progress-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: rgba(255,255,255,0.1);
        }

        .progress-bar {
            height: 100%;
            background: var(--color-brand-primary);
            width: 35%;
            transition: width 0.3s ease;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .app-layout {
                grid-template-columns: 1fr;
                grid-template-rows: 1fr var(--player-height);
            }

            .sidebar {
                display: none;
            }

            .main-header {
                flex-direction: column;
                gap: var(--spacing-md);
                align-items: stretch;
            }

            .hero-content h1 {
                font-size: 32px;
            }

            .album-grid {
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            }

            .player-track {
                width: auto;
                min-width: 200px;
            }

            .player-controls {
                gap: var(--spacing-sm);
            }

            .player-extras {
                width: auto;
                min-width: 100px;
            }
        }

        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.6s ease forwards;
        }

        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--color-bg-page);
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.2);
        }

        /* Loading animation */
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .loading {
            animation: pulse 2s infinite;
        }
    </style>
</head>
<body>
    <audio src="" id="audio" crossOrigin="anonymous"></audio>
    <div class="app-layout">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="logo">
                <i class="fas fa-music"></i>
                High Distortion
            </div>

            <nav class="nav-section">
                <div class="nav-title">Discover</div>
                <a href="#" class="nav-item active">
                    <i class="fas fa-home"></i>
                    Home
                </a>
                <a href="#" class="nav-item">
                    <i class="fas fa-search"></i>
                    Search
                </a>
                <a href="#" class="nav-item">
                    <i class="fas fa-compass"></i>
                    Browse
                </a>
            </nav>

            <div class="nav-section">
                <div class="nav-title">Library</div>
                <a href="#" class="nav-item">
                    <i class="fas fa-music"></i>
                    Songs
                </a>
                <a href="#" class="nav-item">
                    <i class="fas fa-compact-disc"></i>
                    Albums
                </a>
                <a href="#" class="nav-item">
                    <i class="fas fa-microphone-alt"></i>
                    Artists
                </a>
                <a href="#" class="nav-item">
                    <i class="fas fa-heart"></i>
                    Liked Songs
                </a>
            </div>

            <div class="nav-section">
                <div class="nav-title">Playlists</div>
                <a href="#" class="playlist-item active">
                    High Distortion
                    <span class="playlist-badge">42</span>
                </a>
                <a href="#" class="playlist-item">
                    Rock Essentials
                </a>
                <a href="#" class="playlist-item">
                    Alternative Mix
                </a>
                <a href="#" class="playlist-item">
                    Indie Favorites
                </a>
                <a href="#" class="playlist-item">
                    Electronic Vibes
                </a>
            </div>
        </div>

        <!-- Main Content -->
        <main class="main-content">
            <header class="main-header">
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-bar" placeholder="Search for songs, artists, albums...">
                </div>
                <div class="user-controls">
                    <button class="btn-icon" title="Notifications">
                        <i class="fas fa-bell"></i>
                    </button>
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face" alt="User Avatar" class="avatar">
                </div>
            </header>

            <!-- Hero Section -->
            <section class="hero-section fade-in">
                <div class="hero-content">
                    <h1>High Distortion</h1>
                    <p>Curated playlist featuring the best of alternative and indie rock</p>
                    <div class="hero-stats">
                        <div class="stat-item">
                            <span>42</span>
                            <small>Songs</small>
                        </div>
                        <div class="stat-item">
                            <span>2h 47m</span>
                            <small>Duration</small>
                        </div>
                        <div class="stat-item">
                            <span>1.2K</span>
                            <small>Followers</small>
                        </div>
                    </div>
                    <div class="hero-actions">
                        <button class="btn btn-primary" id="playBtn">
                            <i class="fas fa-play"></i>
                            Play All
                        </button>
                        <button class="btn btn-icon" title="Like this playlist">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn btn-icon" title="Share playlist">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </section>

            <!-- Song List -->
            <section class="content-section fade-in">
                <div class="section-header">
                    <h2 class="section-title">Tracks</h2>
                </div>
                <div class="song-list">
                    <div class="song-item active" data-track="0">
                        <span class="song-number">1</span>
                        <div class="song-info">
                            <div class="song-title">Midnight City</div>
                            <div class="song-artist">M83</div>
                        </div>
                        <span class="song-duration">4:03</span>
                    </div>
                    <div class="song-item" data-track="1">
                        <span class="song-number">2</span>
                        <div class="song-info">
                            <div class="song-title">Somebody Told Me</div>
                            <div class="song-artist">The Killers</div>
                        </div>
                        <span class="song-duration">3:17</span>
                    </div>
                    <div class="song-item" data-track="2">
                        <span class="song-number">3</span>
                        <div class="song-info">
                            <div class="song-title">Electric Feel</div>
                            <div class="song-artist">MGMT</div>
                        </div>
                        <span class="song-duration">3:49</span>
                    </div>
                    <div class="song-item" data-track="3">
                        <span class="song-number">4</span>
                        <div class="song-info">
                            <div class="song-title">Take Me Out</div>
                            <div class="song-artist">Franz Ferdinand</div>
                        </div>
                        <span class="song-duration">3:57</span>
                    </div>
                    <div class="song-item" data-track="4">
                        <span class="song-number">5</span>
                        <div class="song-info">
                            <div class="song-title">Pumped Up Kicks</div>
                            <div class="song-artist">Foster the People</div>
                        </div>
                        <span class="song-duration">3:59</span>
                    </div>
                    <div class="song-item" data-track="5">
                        <span class="song-number">6</span>
                        <div class="song-info">
                            <div class="song-title">Seven Nation Army</div>
                            <div class="song-artist">The White Stripes</div>
                        </div>
                        <span class="song-duration">3:51</span>
                    </div>
                </div>
            </section>

            <!-- Recently Played -->
            <section class="content-section fade-in">
                <div class="section-header">
                    <h2 class="section-title">Recently Played</h2>
                    <a href="#" class="section-link">See all</a>
                </div>
                <div class="album-grid">
                    <div class="album-card">
                        <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=96&h=96&fit=crop" alt="Hurry Up, We're Dreaming Album Cover" class="album-cover">
                        <div class="album-title">Hurry Up, We're Dreaming</div>
                        <div class="album-artist">M83</div>
                    </div>
                    <div class="album-card">
                        <img src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=96&h=96&fit=crop" alt="Hot Fuss Album Cover" class="album-cover">
                        <div class="album-title">Hot Fuss</div>
                        <div class="album-artist">The Killers</div>
                    </div>
                    <div class="album-card">
                        <img src="https://images.unsplash.com/photo-1518972358870-2e8d8cd8bd3a?w=96&h=96&fit=crop" alt="Oracular Spectacular Album Cover" class="album-cover">
                        <div class="album-title">Oracular Spectacular</div>
                        <div class="album-artist">MGMT</div>
                    </div>
                    <div class="album-card">
                        <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=96&h=96&fit=crop" alt="Franz Ferdinand Album Cover" class="album-cover">
                        <div class="album-title">Franz Ferdinand</div>
                        <div class="album-artist">Franz Ferdinand</div>
                    </div>
                    <div class="album-card">
                        <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=96&h=96&fit=crop" alt="Torches Album Cover" class="album-cover">
                        <div class="album-title">Torches</div>
                        <div class="album-artist">Foster the People</div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Bottom Player -->
        <div class="bottom-player">
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
            
            <div class="player-track">
                <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop" alt="Now Playing: Midnight City" class="player-thumbnail">
                <div class="player-info">
                    <div class="track-title">Midnight City</div>
                    <div class="track-artist">M83</div>
                </div>
            </div>

            <div class="player-controls">
                <button class="control-btn" title="Shuffle">
                    <i class="fas fa-random"></i>
                </button>
                <button class="control-btn" title="Previous track">
                    <i class="fas fa-step-backward"></i>
                </button>
                <button class="control-btn play-pause" id="playPauseBtn" title="Play/Pause">
                    <i class="fas fa-pause"></i>
                </button>
                <button class="control-btn" title="Next track">
                    <i class="fas fa-step-forward"></i>
                </button>
                <button class="control-btn" title="Repeat">
                    <i class="fas fa-redo"></i>
                </button>
            </div>

            <div class="player-extras">
                <div class="volume-control">
                    <button class="control-btn" title="Volume">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
                <button class="control-btn" title="Fullscreen">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
    </div>

    <script>
        // Music app data and functionality
        const tracks = JSON.parse(await env.music.get("music-data.json"));

        let currentTrack = 0;
        let isPlaying = true;
        let progressInterval;

        // DOM Elements
        const playBtn = document.getElementById('playBtn');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const songItems = document.querySelectorAll('.song-item');
        const progressBar = document.querySelector('.progress-bar');
        const playerThumbnail = document.querySelector('.player-thumbnail');
        const trackTitle = document.querySelector('.track-title');
        const trackArtist = document.querySelector('.track-artist');
        const audio = document.getElementById('audio');

        // Initialize animations
        function initAnimations() {
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }

        // Update player display
        function updatePlayer(trackIndex) {
            const track = tracks[trackIndex];
            if (track) {
                playerThumbnail.src = track.cover;
                playerThumbnail.alt = "Now Playing: " + track.title;
                trackTitle.textContent = track.title;
                trackArtist.textContent = track.artist;
                audio.src = track.url; // Placeholder URL
                
                // Update active song
                songItems.forEach((item, index) => {
                    item.classList.toggle('active', index === trackIndex);
                });

                // Reset progress
                progressBar.style.width = '0%';
            }
        }

        // Toggle play/pause
        function togglePlayPause() {
            isPlaying = !isPlaying;
            const icon = playPauseBtn.querySelector('i');
            const playBtnIcon = playBtn.querySelector('i');
            
            if (isPlaying) {
                icon.className = 'fas fa-pause';
                playBtnIcon.className = 'fas fa-pause';
                playBtn.innerHTML = '<i class="fas fa-pause"></i>Pause';
                audio.play();
                startProgress();
            } else {
                icon.className = 'fas fa-play';
                playBtnIcon.className = 'fas fa-play';
                playBtn.innerHTML = '<i class="fas fa-play"></i>Play All';
                audio.pause();
                stopProgress();
            }
        }

        // Progress simulation
        function startProgress() {
            stopProgress();
            progressInterval = setInterval(updateProgress, 200);
        }

        function stopProgress() {
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
        }

        function updateProgress() {
            if (isPlaying) {
                let currentWidth = parseFloat(progressBar.style.width) || 0;
                if (currentWidth >= 100) {
                    nextTrack();
                } else {
                    progressBar.style.width = (currentWidth + 0.5) + '%';
                }
            }
        }

        // Track navigation
        function nextTrack() {
            currentTrack = (currentTrack + 1) % tracks.length;
            updatePlayer(currentTrack);
            if (isPlaying) {
                startProgress();
            }
        }

        function previousTrack() {
            currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
            updatePlayer(currentTrack);
            if (isPlaying) {
                startProgress();
            }
        }

        // Event Listeners
        playBtn.addEventListener('click', togglePlayPause);
        playPauseBtn.addEventListener('click', togglePlayPause);

        // Control buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon.classList.contains('fa-step-forward')) {
                btn.addEventListener('click', nextTrack);
            } else if (icon.classList.contains('fa-step-backward')) {
                btn.addEventListener('click', previousTrack);
            }
        });

        // Song selection
        songItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentTrack = index;
                updatePlayer(currentTrack);
                if (!isPlaying) {
                    togglePlayPause();
                } else {
                    startProgress();
                }
            });
        });

        // Search functionality
        const searchBar = document.querySelector('.search-bar');
        searchBar.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            console.log('Searching for:', query);
            // Future: Implement search functionality
        });

        // Album card interactions
        document.querySelectorAll('.album-card').forEach(card => {
            card.addEventListener('click', () => {
                const albumTitle = card.querySelector('.album-title').textContent;
                console.log('Playing album:', albumTitle);
                // Future: Implement album playback
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextTrack();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    previousTrack();
                    break;
            }
        });

        // Initialize application
        document.addEventListener('DOMContentLoaded', () => {
            initAnimations();
            updatePlayer(currentTrack);
            startProgress();

            // Performance optimization: Preload next track image
            const nextTrackIndex = (currentTrack + 1) % tracks.length;
            if (tracks[nextTrackIndex]) {
                const img = new Image();
                img.src = tracks[nextTrackIndex].cover;
            }
        });

        // Service worker registration for potential PWA features
        if ('serviceWorker' in navigator) {
            // Future: Add service worker for offline functionality
        }

        // Analytics tracking (placeholder)
        function trackEvent(action, label) {
            console.log("Analytics: " + action + " - " + label);
            // Future: Implement analytics
        }

        // Music visualizer
        const canvas = document.getElementById('visualizer');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let audioContext;
        let analyser;
        let source;
        let fbcArray;

        function initVisualizer() {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            source = audioContext.createMediaElementSource(document.querySelector('audio'));
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            fbcArray = new Uint8Array(analyser.frequencyBinCount);
            renderFrame();
        }

        function renderFrame() {
            window.requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(fbcArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FF2763';
            const bars = 100;
            for (let i = 0; i < bars; i++) {
                const barX = i * 3;
                const barWidth = 2;
                const barHeight = -(fbcArray[i] / 2);
                ctx.fillRect(barX, canvas.height, barWidth, barHeight);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            initVisualizer();
        });

        // Track user interactions
        playPauseBtn.addEventListener('click', () => trackEvent('play_pause', isPlaying ? 'pause' : 'play'));
        songItems.forEach((item, index) => {
            item.addEventListener('click', () => trackEvent('track_select', tracks[index].title));
        });
    </script>
        <canvas id="visualizer"></canvas>
    </body>
</html>`;

    return new Response(html, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'public, max-age=86400',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'x-xss-protection': '1; mode=block',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'access-control-allow-origin': '*',
      },
    });
  },
};

// API handler for future expansion
async function handleAPI(request, env) {
  const url = new URL(request.url);
  const endpoint = url.pathname.replace('/api/', '');

  switch (endpoint) {
    case 'tracks':
      return new Response(JSON.stringify({
        tracks: [
          { id: 1, title: "Midnight City", artist: "M83", duration: "4:03" },
          { id: 2, title: "Somebody Told Me", artist: "The Killers", duration: "3:17" },
          // Add more tracks...
        ]
      }), {
        headers: { 'content-type': 'application/json' },
      });

    case 'search':
      const query = url.searchParams.get('q');
      return new Response(JSON.stringify({
        query,
        results: [],
        // Implement search logic
      }), {
        headers: { 'content-type': 'application/json' },
      });

    default:
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
  }
}