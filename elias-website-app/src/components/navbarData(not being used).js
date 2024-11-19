const navbarItems = [
    {
        title: 'Home',
        link: '/'
    },
    {
        title: 'Resume',
        link: '/resume'
    },
    {
        title: 'Other Stuff',
        submenu: [
            {
                title: 'Research',
                link: '/research',
                submenu: [
                    { title: 'Birla Poster', link: '/birla' },
                    { title: 'D-wave Proposal', link: '/dwave' }
                ],
            },
            {
                title: 'Music',
                link: '/music'
            }
        ]
    },
];

export default navbarItems;
