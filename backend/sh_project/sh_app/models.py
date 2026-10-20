from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
import uuid


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        DONOR = "DONOR", "Donor"
        NGO_ADMIN = "NGO_ADMIN", "NGO Admin"
        NGO_STAFF = "NGO_STAFF", "NGO Staff"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.DONOR)
    phone = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    hashed_otp = models.CharField(max_length=128, blank=True, null=True)
    otp_expires_at = models.DateTimeField(blank=True, null=True)
    reset_hash = models.CharField(max_length=128, blank=True, null=True)
    reset_expires_at = models.DateTimeField(blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if self.otp_expires_at and self.otp_expires_at < timezone.now():
            self.hashed_otp = None
            self.otp_expires_at = None
        super().save(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.is_staff or self.is_superuser:
            self.role = self.Role.ADMIN

        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

class NGO(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    name = models.CharField(max_length=200)
    registration_number = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    ngo_logo = models.ImageField(upload_to="ngo_logos/", blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="ngos_created")
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="ngos_reviewed")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class NGODocument(models.Model):
    class DocumentType(models.TextChoices):
        REGISTRATION = "REGISTRATION", "Registration Document"
        TAX_EXEMPTION = "TAX_EXEMPTION", "Tax Exemption Certificate"
        OTHER = "OTHER", "Other"

    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE, related_name="documents")
    document_type = models.CharField(max_length=20, choices=DocumentType.choices)
    document_file = models.FileField(upload_to="ngo_documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ngo.name} - {self.document_type}"


class NGOMembership(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"

    ngo = models.ForeignKey(NGO, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ngo_memberships")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["ngo", "user"], name="unique_ngo_member")]

    def __str__(self):
        return f"{self.user.username} - {self.ngo.name}"


class Campaign(models.Model):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PENDING = "PENDING", "Pending Approval"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        ACTIVE = "ACTIVE", "Active"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    class DonationType(models.TextChoices):
        FUND = "FUND", "Fund"
        ITEM = "ITEM", "Physical Items"
        BOTH = "BOTH", "Funds and Items"

    ngo = models.ForeignKey(NGO, on_delete=models.PROTECT, related_name="campaigns")
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    donation_type = models.CharField(max_length=10, choices=DonationType.choices, default=DonationType.FUND)
    goal_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    goal_quantity = models.PositiveIntegerField(null=True, blank=True)
    goal_item_name = models.CharField(max_length=150, blank=True)
    currency = models.CharField(max_length=3, default="NPR")
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    campaign_image = models.ImageField(upload_to="campaign_images/", blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="campaigns_created")
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="campaigns_reviewed")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Donation(models.Model):
    class DonationType(models.TextChoices):
        FUND = "FUND", "Money"
        ITEM = "ITEM", "Physical Item"

    class Status(models.TextChoices):
        SUBMITTED = "SUBMITTED", "Submitted"
        RECEIVED = "RECEIVED", "Received"
        VERIFIED = "VERIFIED", "Verified"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        CANCELLED = "CANCELLED", "Cancelled"

    reference_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    campaign = models.ForeignKey(Campaign, on_delete=models.PROTECT, related_name="donations")
    donor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="donations")
    donation_type = models.CharField(max_length=10, choices=DonationType.choices)
    is_anonymous = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBMITTED)
    donor_name = models.CharField(max_length=150, blank=True)
    donor_email = models.EmailField(blank=True)
    donor_phone = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.reference_number)


class DonationItem(models.Model):
    donation = models.ForeignKey(Donation, on_delete=models.CASCADE, related_name="items")
    item_name = models.CharField(max_length=150)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit = models.CharField(max_length=30, default="piece")
    condition = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.item_name} x {self.quantity}"


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SUCCESS = "SUCCESS", "Successful"
        FAILED = "FAILED", "Failed"
        REFUNDED = "REFUNDED", "Refunded"

    donation = models.ForeignKey(Donation, on_delete=models.PROTECT, related_name="payments")
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    currency = models.CharField(max_length=3, default="NPR")
    payment_method = models.CharField(max_length=50, default="CASH")
    transaction_id = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.donation.reference_number} - {self.amount} {self.currency}"


class DonationVerification(models.Model):
    class Result(models.TextChoices):
        RECEIVED = "RECEIVED", "Received"
        PARTIAL = "PARTIAL", "Partially Received"
        NOT_RECEIVED = "NOT_RECEIVED", "Not Received"
        DAMAGED = "DAMAGED", "Damaged"

    donation = models.ForeignKey(Donation, on_delete=models.PROTECT, related_name="verifications")
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="donation_verifications")
    result = models.CharField(max_length=20, choices=Result.choices)
    notes = models.TextField(blank=True)
    evidence_image = models.URLField(max_length=1000, blank=True)
    verified_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.donation.reference_number} - {self.result}"


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class AuditLog(models.Model):
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_logs")
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=100)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.action} - {self.entity_type} {self.entity_id}"
