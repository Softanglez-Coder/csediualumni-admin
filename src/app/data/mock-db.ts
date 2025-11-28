export const MOCK_DB = {
    users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', joinedDate: '2023-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'member', status: 'pending', joinedDate: '2023-02-20' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'member', status: 'active', joinedDate: '2023-03-10' },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'member', status: 'rejected', joinedDate: '2023-04-05' },
        { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'admin', status: 'active', joinedDate: '2023-05-12' }
    ],
    events: [
        { id: 1, title: 'Annual Alumni Meetup', date: '2023-12-25', location: 'Dhaka', status: 'upcoming' },
        { id: 2, title: 'Career Guidance Seminar', date: '2023-11-15', location: 'Online', status: 'completed' }
    ],
    blogs: [
        { id: 1, title: 'Welcome to the new portal', author: 'Admin', date: '2023-10-01', content: '...' }
    ],
    committees: [
        { id: 1, name: 'Executive Committee 2023', members: 12 }
    ]
};
