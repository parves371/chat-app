export const sampleChat = [
  {
    avatar: ["https://i.pravatar.cc/150?u=1"],
    name: "Mohamed",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: ["https://i.pravatar.cc/150?u=2", "https://i.pravatar.cc/150?u=3"],
    name: "Ahmed",
    _id: "2",
    groupChat: true,
    members: ["1", "2"],
  },
];

export const sampleUser = [
  {
    name: "Mohamed",
    avatar: "https://i.pravatar.cc/150?u=1",
    _id: "1",
  },
  {
    name: "Ahmed",
    avatar: "https://i.pravatar.cc/150?u=2",
    _id: "2",
  },
];
export const sampleNotification = [
  {
    sender: { name: "Mohamed", avatar: "https://i.pravatar.cc/150?u=1" },
    _id: "1",
  },
  {
    sender: { name: "Ahmed", avatar: "https://i.pravatar.cc/150?u=2" },
    _id: "2",
  },
];

export const sampleMessage = [
  {
    attachments: [
      {
        public_id: "kjk",
        url: "https://picsum.photos/500/320.jpg",
      },
    ],
    content: "Hello",
    _id: "1",
    sender: {
      _id: "user._id",
      name: "mohammed ",
    },
    chat: "chatId",
    createdAt: "2024-07-16T00:00:00.000Z",
  },
  {
    attachments: [
      {
        public_id: "kjk2",
        url: "https://picsum.photos/300/200.jpg",
      },
    ],
    content: "Hello",
    _id: "2",
    sender: {
      _id: "user._id2",
      name: "parves ",
    },
    chat: "chatId",
    createdAt: "2024-07-16T08:10:00.000Z",
  },
];

export const adminDashboardData = {
  users: [
    {
      name: "Mohamed",
      avatar: "https://i.pravatar.cc/150?u=45",
      _id: "1",
      username: "mohammed",
      friends: 12,
      groups: 2,
    },
    {
      name: "Ahmed",
      avatar: "https://i.pravatar.cc/150?u=55",
      _id: "2",
      username: "ahmed",
      friends: 12,
      groups: 2,
    },
  ],
  chats: [
    {
      name: "3 Love Bards",
      avatar: ["https://i.pravatar.cc/150?u=33"],
      _id: "1",
      groupChat: false,
      members: [
        { _id: "1", avatar: "https://i.pravatar.cc/150?u=33" },
        { _id: "2", avatar: "https://i.pravatar.cc/150?u=55" },
      ],
      totalMembers: 2,
      totalMessages: 12,
      creator: {
        name: "Mohamed",
        avatar: "https://i.pravatar.cc/150?u=33",
      },
    },
    {
      name: "4 Love Bards",
      avatar: ["https://i.pravatar.cc/150?u=55"],
      _id: "2",
      groupChat: true,
      members: [
        { _id: "1", avatar: "https://i.pravatar.cc/150?u=33" },
        { _id: "2", avatar: "https://i.pravatar.cc/150?u=55" },
      ],
      totalMembers: 2,
      totalMessages: 12,
      creator: {
        name: "Mohamed",
        avatar: "https://i.pravatar.cc/150?u=55",
      },
    },
  ],
  messages: [
    {
      attachments: [],
      content: "Hello",
      _id: "1",
      sender: {
        avatar: "https://i.pravatar.cc/150?u=95",
        name: "mohammed ",
      },
      chat: "chatId",
      groupChat: false,
      createdAt: "2024-07-16T00:00:00.000Z",
    },
    {
      attachments: [
        { public_id: "kjk2", url: "https://picsum.photos/300/200.jpg" },
        { public_id: "kjk2", url: "https://picsum.photos/300/200.jpg" },
      ],
      content: "Hello",
      _id: "2",
      sender: {
        avatar: "https://i.pravatar.cc/150?u=55",
        name: "parves ",
      },
      chat: "chatId",
      groupChat: true,
      createdAt: "2024-07-16T08:10:00.000Z",
    },
  ],
};
