export const uploadImageToCloudinary = async (file) => {
  const formdata = new FormData()
  formdata.append('file', file)
  formdata.append('upload_preset', 'Free public upload') // upload_preset from cloudinary settings
  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/dillpoweh/image/upload', {
      method: 'POST',
      body: formdata,
    })
    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary')
    }
    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw error
  }
}
