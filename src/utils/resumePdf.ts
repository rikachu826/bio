import type { PDFFont } from 'pdf-lib'

type CardSection = {
  title: string
  items: string[]
  accent: { r: number; g: number; b: number }
  background: { r: number; g: number; b: number }
}

const palette = {
  text: { r: 0.13, g: 0.14, b: 0.18 },
  headerText: { r: 0.95, g: 0.98, b: 1 },
  sky: { r: 0.2, g: 0.55, b: 0.95 },
  teal: { r: 0.18, g: 0.8, b: 0.7 },
  violet: { r: 0.43, g: 0.35, b: 0.92 },
  navy: { r: 0.05, g: 0.09, b: 0.2 },
  slate: { r: 0.93, g: 0.95, b: 0.98 },
}

export async function generateResumePdf() {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')

  const doc = await PDFDocument.create()
  const pageSize: [number, number] = [612, 792]
  let page = doc.addPage(pageSize)
  const marginX = 54
  const contentWidth = pageSize[0] - marginX * 2
  const columnGap = 18
  const columnWidth = (contentWidth - columnGap) / 2

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const wrapText = (text: string, size: number, font: PDFFont, maxWidth: number) => {
    const words = text.split(' ')
    const lines: string[] = []
    let line = ''
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word
      const width = font.widthOfTextAtSize(testLine, size)
      if (width > maxWidth && line) {
        lines.push(line)
        line = word
      } else {
        line = testLine
      }
    }
    if (line) {
      lines.push(line)
    }
    return lines
  }

  const drawBackground = () => {
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1],
      color: rgb(palette.slate.r, palette.slate.g, palette.slate.b),
    })
  }

  const drawTopBar = () => {
    page.drawRectangle({
      x: 0,
      y: pageSize[1] - 24,
      width: pageSize[0],
      height: 24,
      color: rgb(0.06, 0.1, 0.2),
      opacity: 0.9,
    })
    page.drawRectangle({
      x: 0,
      y: pageSize[1] - 24,
      width: pageSize[0],
      height: 2,
      color: rgb(palette.sky.r, palette.sky.g, palette.sky.b),
      opacity: 0.9,
    })
  }

  const drawHeader = () => {
    const headerHeight = 130
    const steps = 12
    for (let i = 0; i < steps; i += 1) {
      const t = i / (steps - 1)
      const color = {
        r: palette.navy.r + (palette.sky.r - palette.navy.r) * t * 0.2,
        g: palette.navy.g + (palette.sky.g - palette.navy.g) * t * 0.2,
        b: palette.navy.b + (palette.sky.b - palette.navy.b) * t * 0.2,
      }
      page.drawRectangle({
        x: 0,
        y: pageSize[1] - headerHeight + i * (headerHeight / steps),
        width: pageSize[0],
        height: headerHeight / steps + 1,
        color: rgb(color.r, color.g, color.b),
      })
    }

    page.drawRectangle({
      x: 0,
      y: pageSize[1] - headerHeight,
      width: pageSize[0],
      height: headerHeight,
      color: rgb(0.05, 0.08, 0.16),
      opacity: 0.88,
    })

    page.drawText('Leo Chui', {
      x: marginX,
      y: pageSize[1] - 70,
      size: 26,
      font: fontBold,
      color: rgb(palette.headerText.r, palette.headerText.g, palette.headerText.b),
    })

    page.drawText('Associate IT Director, GLAAD', {
      x: marginX,
      y: pageSize[1] - 95,
      size: 13,
      font: fontRegular,
      color: rgb(0.78, 0.88, 0.98),
    })

    page.drawText('AI-augmented systems, security, and infrastructure leader', {
      x: marginX,
      y: pageSize[1] - 113,
      size: 11,
      font: fontRegular,
      color: rgb(0.7, 0.82, 0.98),
    })
  }

  const measureCard = (section: CardSection, width: number) => {
    const padding = 14
    const titleLines = wrapText(section.title, 13, fontBold, width - padding * 2 - 8)
    const itemLines = section.items.flatMap((item) =>
      wrapText(`- ${item}`, 10.5, fontRegular, width - padding * 2 - 8)
    )
    const titleHeight = titleLines.length * 18
    const itemsHeight = itemLines.length * 15
    return padding * 2 + titleHeight + itemsHeight + 6
  }

  const drawCard = (section: CardSection, x: number, yTop: number, width: number) => {
    const padding = 14
    const titleLines = wrapText(section.title, 13, fontBold, width - padding * 2 - 8)
    const itemLines = section.items.flatMap((item) =>
      wrapText(`- ${item}`, 10.5, fontRegular, width - padding * 2 - 8)
    )
    const titleHeight = titleLines.length * 18
    const itemsHeight = itemLines.length * 15
    const height = padding * 2 + titleHeight + itemsHeight + 6
    const cardTop = yTop
    const cardBottom = yTop - height

    page.drawRectangle({
      x,
      y: cardBottom,
      width,
      height,
      color: rgb(section.background.r, section.background.g, section.background.b),
      borderColor: rgb(0.83, 0.86, 0.92),
      borderWidth: 1,
    })

    page.drawRectangle({
      x,
      y: cardBottom,
      width: 4,
      height,
      color: rgb(section.accent.r, section.accent.g, section.accent.b),
    })

    let textY = cardTop - padding - 4
    for (const line of titleLines) {
      page.drawText(line, {
        x: x + 12,
        y: textY,
        size: 13,
        font: fontBold,
        color: rgb(section.accent.r, section.accent.g, section.accent.b),
      })
      textY -= 18
    }

    for (const line of itemLines) {
      page.drawText(line, {
        x: x + 12,
        y: textY,
        size: 10.5,
        font: fontRegular,
        color: rgb(palette.text.r, palette.text.g, palette.text.b),
      })
      textY -= 15
    }

    return cardBottom - 18
  }

  drawBackground()
  drawHeader()

  let leftY = pageSize[1] - 158
  let rightY = leftY

  const placeCard = (section: CardSection) => {
    const minY = 54
    const height = measureCard(section, columnWidth)
    const leftHasRoom = leftY - height >= minY
    const rightHasRoom = rightY - height >= minY

    if (!leftHasRoom && !rightHasRoom) {
      page = doc.addPage(pageSize)
      drawBackground()
      drawTopBar()
      leftY = pageSize[1] - 50
      rightY = leftY
    }

    if (leftY >= rightY) {
      if (!leftHasRoom && rightHasRoom) {
        rightY = drawCard(section, marginX + columnWidth + columnGap, rightY, columnWidth)
      } else {
        leftY = drawCard(section, marginX, leftY, columnWidth)
      }
    } else if (!rightHasRoom && leftHasRoom) {
      leftY = drawCard(section, marginX, leftY, columnWidth)
    } else {
      rightY = drawCard(section, marginX + columnWidth + columnGap, rightY, columnWidth)
    }
  }

  const sections: CardSection[] = [
    {
      title: 'Experience Highlights',
      accent: palette.sky,
      background: { r: 0.94, g: 0.97, b: 1 },
      items: [
        '72-hour migration from Windows Server 2008 to a cloud-native, remote-first stack',
        'Built LuminOS, five production AI apps across security, finance, media, and legal',
        'SecurityScorecard average 98/100 over five years, remediation in progress',
        'Hybrid office stack with 10GbE backbone and resilient WAN failover',
      ],
    },
    {
      title: 'Legacy Environment (2019)',
      accent: palette.violet,
      background: { r: 0.97, g: 0.95, b: 1 },
      items: [
        'End-of-life Windows Server 2008 domain controller',
        'Shared VPN credentials, no modern MFA, and EOL firewalls',
        'LA file server on site-to-site VPN with no verified backups',
        'Hybrid Exchange with severe storage constraints',
      ],
    },
    {
      title: 'Transformation Timeline',
      accent: palette.teal,
      background: { r: 0.93, g: 0.99, b: 0.98 },
      items: [
        'Remote-enabled staff in 72 hours with cloud email and collaboration',
        'Migrated ShoreTel to Verizon One Talk after the remote shift',
        'JumpCloud identity with Workspace sync and ABM-managed devices',
        'Private EC2 rsync bridge for Microsoft 365 and Workspace data',
      ],
    },
    {
      title: 'Security and Identity',
      accent: palette.teal,
      background: { r: 0.94, g: 0.99, b: 0.97 },
      items: [
        'JumpCloud identity, Jamf MDM, and YubiKey-only MFA',
        'CrowdStrike endpoint security and Proofpoint email protection',
        'Layered backups with SaaS, NAS, and encrypted offsite replication',
        'Nudge Security for OAuth governance and AI DLP visibility',
      ],
    },
    {
      title: 'Hybrid Office and Media Ops',
      accent: palette.violet,
      background: { r: 0.97, g: 0.95, b: 1 },
      items: [
        'Ubiquiti network stack with segmented office and production VLANs',
        'Dual-WAN failover with warm standby and 10GbE backbone',
        'Verkada physical security tied to JumpCloud access governance',
      ],
    },
    {
      title: 'GLAAD.org Platform',
      accent: palette.sky,
      background: { r: 0.95, g: 0.97, b: 1 },
      items: [
        'Route 53 DNS, CloudFront WAF, segmented EC2 tiers',
        'Publishing locked behind VPN + MFA for core WordPress access',
        'Bynder DAM behind SSO for controlled media assets',
        'Tableau dashboards tracking anti-LGBTQ hate and hate crime trends',
      ],
    },
    {
      title: 'LuminOS Ecosystem',
      accent: palette.teal,
      background: { r: 0.94, g: 0.99, b: 0.97 },
      items: [
        'Diffract security, Refract finance, Prism and Spectrum media intelligence',
        'NetRunner desktop legal analysis with server-side OAuth exchange',
        'AI-agnostic architecture with rapid model upgrades and fallbacks',
      ],
    },
    {
      title: 'Outcomes',
      accent: palette.sky,
      background: { r: 0.94, g: 0.97, b: 1 },
      items: [
        'Zero-trust aligned posture with prevention-first operations',
        'Sub-minute response to critical issues without a ticket backlog',
        'Executive dashboards for security, finance, and media intelligence',
      ],
    },
    {
      title: 'Contact',
      accent: palette.sky,
      background: { r: 0.95, g: 0.97, b: 1 },
      items: ['leo@leochui.tech', 'leochui.tech'],
    },
  ]

  sections.forEach(placeCard)

  const pdfBytes = await doc.save()
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'Leo_Chui_Resume.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
