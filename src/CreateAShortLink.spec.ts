describe('create a short link', () => {
  it('should be able to create a short link', async () => {
    const createLink = new CreateLinkService()

    const link = await createLink.execute({
      originLink:'https://www.google.com',
    })

    expect(link).toContain({
      originLink: 'https://www.google.com'
    })

  })
})
