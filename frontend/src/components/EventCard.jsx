import { useState, useEffect } from 'react';
import { addComment, getComments, toggleLike, getLikes } from '../utils/api';
import api from '../utils/api';

const EventCard = ({ event }) => {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        fetchLikes();
    }, [event.id]);

    const fetchLikes = async () => {
        try {
            const response = await getLikes(event.id);
            setLikes(response.data.count);
            setIsLiked(response.data.liked);
        } catch (error) {
            console.error("Failed to fetch likes", error);
        }
    };

    const handleLike = async () => {
        try {
            const response = await toggleLike(event.id);
            setIsLiked(response.data.liked);
            setLikes((prev) => response.data.liked ? prev + 1 : prev - 1);
        } catch (error) {
            alert('Failed to like/unlike. Make sure you are logged in.');
        }
    };

    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            setLoadingComments(true);
            try {
                const response = await getComments(event.id);
                setComments(response.data || []);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            } finally {
                setLoadingComments(false);
            }
        }
        setShowComments(!showComments);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await addComment(event.id, newComment);
            // Optimistically add the comment or re-fetch.
            // Be careful to include user data if possible, or wait for re-fetch.
            // Ideally backend returns the complete comment object with user info or we mock it.
            // Backend returns the created comment, but missing username.
            // Let's re-fetch for simplicity or append partial data.
            // Since we need username, re-fetching is safer or we need to know current user.
            const createdComment = response.data;
            // Hack: Since we don't have username easily here without AuthContext, 
            // maybe we just show "You" or refresh.
            const responseComments = await getComments(event.id);
            setComments(responseComments.data || []);
            setNewComment('');
        } catch (error) {
            alert('Failed to add comment');
        }
    };

    const handleJoin = async () => {
        try {
            await api.post(`/events/${event.id}/join`);
            alert('Successfully joined the event!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to join event');
        }
    };

    return (
        <div className="card">
            <h3>{event.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {new Date(event.event_date).toLocaleString()}
            </p>
            <p style={{ fontWeight: '500', marginBottom: '1rem' }}>📍 {event.location}</p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                {event.description}
            </p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                <button
                    onClick={handleLike}
                    className={`btn ${isLiked ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                >
                    {isLiked ? '❤️ Liked' : '🤍 Like'} ({likes})
                </button>
                <button
                    onClick={toggleComments}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                >
                    💬 Comments
                </button>
            </div>

            <button
                onClick={handleJoin}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '1rem' }}
            >
                Join Event
            </button>

            {showComments && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="input"
                            style={{ flex: 1 }}
                        />
                        <button type="submit" className="btn btn-primary">Post</button>
                    </form>

                    {loadingComments ? <p>Loading...</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {comments.map(c => (
                                <div key={c.id} style={{ background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                    <strong style={{ fontSize: '0.9rem' }}>{c.user_name || 'User ' + c.user_id}</strong>
                                    <p style={{ margin: '0.2rem 0', fontSize: '0.95rem' }}>{c.content}</p>
                                    <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(c.created_at).toLocaleString()}</small>
                                </div>
                            ))}
                            {comments.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No comments yet.</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventCard;
