import prisma from '../src/db.server'

async function main() {
    // await prisma.book.delete({
    //     where: {
    //         id: 'a1bb5ebd-bbad-47d9-9efd-f5b0d9617b56'
    //     }
    // })
    await prisma.book.createMany({
        data:[
            {
                title: "the leader in me",
                auther: "stephan R.coofy",
                publishedAt: new Date(),
                pages: 304
            },
            {
                title: "منازل الروح",
                auther: "عمرو خالد",
                publishedAt: new Date(),
                pages: 200
            }
        ]
    })
}

main().catch(error => {
    console.error(error.message)
})
.finally(async () => prisma.$disconnect());