import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Server API route: returns matches from SQL database in JSON form
// Expects environment variables: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT

async function getConnection() {
  const host = process.env.MYSQL_HOST || 'localhost'
  const user = process.env.MYSQL_USER || 'root'
  const password = process.env.MYSQL_PASSWORD || ''
  const database = process.env.MYSQL_DATABASE || 'tennis_db'
  const port = process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306

  return await mysql.createPool({ host, user, password, database, port, waitForConnections: true, connectionLimit: 5, queueLimit: 0 })
}

export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection()

    // Matches table in the provided screenshots uses columns like id, start_time, status, player names may be in a players table.
    // We'll attempt a simple join if players table exists; otherwise return matches table rows and let the client adapt.

    // Query that works with the actual database structure
    // Since players table has match_id, we'll get players by match_id
    const query = `
      SELECT DISTINCT 
        p.match_id as id,
        'live' as status,
        NOW() as date,
        (SELECT player_name FROM players WHERE match_id = p.match_id LIMIT 1) as player1,
        (SELECT player_name FROM players WHERE match_id = p.match_id LIMIT 1 OFFSET 1) as player2,
        (SELECT score FROM players WHERE match_id = p.match_id LIMIT 1) as player1_score,
        (SELECT score FROM players WHERE match_id = p.match_id LIMIT 1 OFFSET 1) as player2_score
      FROM players p
      WHERE p.match_id IS NOT NULL
      ORDER BY p.match_id DESC
      LIMIT 10
    `

    const [rows] = await pool.query(query)

    // Normalize rows to JSON-friendly objects
    const matches = (rows as any[]).map((r) => ({
      id: String(r.id),
      player1: r.player1 || 'Player 1',
      player2: r.player2 || 'Player 2', 
      score: r.player1_score && r.player2_score ? `${r.player1_score}-${r.player2_score}` : '0-0',
      date: new Date().toISOString(), // Current time for demo
      tournament: 'Bhimavaram Tennis Club',
      status: 'live', // Set to live for PiP demo
      court: 'Court 1',
      live_link: null,
    }))

    return NextResponse.json({ ok: true, matches })
  } catch (err) {
    console.error('Error in /api/matches:', err)
    return NextResponse.json({ ok: false, error: 'Failed to fetch matches from SQL database' }, { status: 500 })
  }
}
