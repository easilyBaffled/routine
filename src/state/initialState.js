import tags from "./tags";
// tags.streak(5),
// { ...tags.recurring }
const initialState = {
  tasks: [
    {
      taskString: "shower: 10",
      task: "shower",
      time: 10,
      value: 0,
      id: "f6b0ca5d-5ad9-4e5c-b6f9-2974f0f6a899",
      active: true,
      tags: [
        {
          id: "active",
          name: "active"
        },
        {
          id: "recurring",
          name: "recurring",
          done: []
        }
      ],
      createdAt: 1606055643406
    },
    {
      taskString: "brush: 4",
      task: "brush",
      time: 4,
      value: 1,
      id: "2f0377a1-d993-40f3-bcc3-ea4cf7972cc7",
      active: true,
      tags: [
        {
          id: "active",
          name: "active"
        },
        tags.streak(5),
        { ...tags.recurring }
      ],
      createdAt: 1606055643406
    },
    {
      taskString: "bed: 8",
      task: "bed",
      time: 8,
      value: 0,
      id: "636504be-7af1-4fd5-a7ad-b87b66a191d8",
      active: true,
      tags: [
        {
          id: "active",
          name: "active"
        },
        {
          id: "recurring",
          name: "recurring",
          done: []
        }
      ],
      createdAt: 1606055643406
    },
    {
      taskString: "headspace: 18",
      task: "headspace",
      time: 18,
      value: 1,
      id: "0ef29b18-e4d9-44c6-bd87-92637129de33",
      active: true,
      tags: [
        {
          id: "active",
          name: "active"
        },
        tags.streak(5),
        { ...tags.recurring }
      ],
      createdAt: 1606055643406
    },
    {
      taskString: "email: 20",
      task: "email",
      time: 20,
      value: 0,
      id: "87355fcb-ef08-48c3-aba7-34162004ef11",
      active: true,
      tags: [
        {
          id: "active",
          name: "active"
        },
        {
          id: "recurring",
          name: "recurring",
          done: []
        }
      ],
      createdAt: 1606055643406
    },
    {
      taskString: "standup: 15",
      task: "standup",
      time: 15,
      value: 0,
      id: "58f2a989-ae01-4708-9cf9-d4aacc743626",
      active: true,
      tags: [
        {
          id: "active",
          name: "active"
        },
        {
          id: "recurring",
          name: "recurring",
          done: []
        }
      ],
      createdAt: 1606055643406
    },
    {
      taskString: "breakfast before 11: 30",
      task: "breakfast",
      time: 30,
      value: 0,
      id: "47d4da6f-f30a-4b41-91af-1d8a13eda49c",
      active: true,
      tags: [
        {
          id: "active",
          name: "active"
        },
        {
          id: "recurring",
          name: "recurring",
          done: []
        }
      ],
      createdAt: 1606055643406
    },
    {
      taskString: "paper: 25",
      task: "paper",
      time: 25,
      value: 1,
      id: "6f082421-85a3-4521-ab38-ab3576e1f226",
      active: true,
      tags: [
        {
          id: "active",
          name: "active"
        },
        {
          id: "recurring",
          name: "recurring",
          done: []
        }
      ],
      createdAt: 1606055643406
    },
    {
      taskString: "read: 16",
      task: "read",
      time: 16,
      value: 1,
      id: "515399f6-f201-4e8f-8569-9fa4dbf28463",
      active: true,
      tags: [
        {
          id: "active",
          name: "active"
        },
        tags.streak(5),
        { ...tags.recurring }
      ],
      createdAt: 1606055643406
    },
    {
      taskString: "stretch: 20",
      task: "stretch",
      time: 20,
      value: 1,
      id: "4a7ceba7-8cde-4e35-bd08-859e7482820e",
      active: true,
      tags: [
        {
          id: "active",
          name: "active"
        },
        {
          id: "recurring",
          name: "recurring",
          done: []
        }
      ],
      createdAt: 1606055643406
    },
    {
      taskString: "lunch before 2: 30",
      task: "lunch",
      time: 30,
      value: 0,
      id: "646ce659-a043-47d7-a16d-e0927a59a054",
      active: true,
      tags: [
        {
          id: "active",
          name: "active"
        },
        {
          id: "recurring",
          name: "recurring",
          done: []
        }
      ],
      createdAt: 1606055643406
    }
  ],
  totalTime: 196,
  bank: 0,
  activeDate: "2020-11-22T14:34:03.405Z"
};

export default initialState;
