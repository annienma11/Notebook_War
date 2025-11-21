using UnityEngine;

namespace NotebookWar.Weapons
{
    public class Shotgun : WeaponBase
    {
        [Header("Shotgun Specific")]
        [SerializeField] private int pelletCount = 8;
        [SerializeField] private float spreadAngle = 15f;
        [SerializeField] private float damageDropoffStart = 10f;
        [SerializeField] private float damageDropoffEnd = 30f;

        protected override void Fire()
        {
            currentAmmo--;
            nextFireTime = Time.time + weaponData.fireRate;

            // Fire multiple pellets in a spread pattern
            for (int i = 0; i < pelletCount; i++)
            {
                FirePellet();
            }
        }

        private void FirePellet()
        {
            // Calculate random spread within cone
            Vector3 spreadDirection = CalculateSpreadDirection();
            
            if (Physics.Raycast(firePoint.position, spreadDirection, out RaycastHit hit, weaponData.range, hitLayers))
            {
                OnPelletHit(hit);
            }
        }

        private Vector3 CalculateSpreadDirection()
        {
            // Random point within a cone
            float randomAngleX = Random.Range(-spreadAngle, spreadAngle);
            float randomAngleY = Random.Range(-spreadAngle, spreadAngle);
            
            Quaternion spread = Quaternion.Euler(randomAngleX, randomAngleY, 0);
            return spread * firePoint.forward;
        }

        private void OnPelletHit(RaycastHit hit)
        {
            // Calculate damage based on distance
            float distance = hit.distance;
            float damageMultiplier = CalculateDamageDropoff(distance);
            float pelletDamage = (weaponData.damage / pelletCount) * damageMultiplier;

            IDamageable damageable = hit.collider.GetComponent<IDamageable>();
            if (damageable != null)
            {
                damageable.TakeDamage(pelletDamage);
            }
        }

        private float CalculateDamageDropoff(float distance)
        {
            if (distance <= damageDropoffStart)
                return 1f; // Full damage at close range
            
            if (distance >= damageDropoffEnd)
                return 0.2f; // Minimum damage at long range
            
            // Linear interpolation between start and end
            float dropoffRange = damageDropoffEnd - damageDropoffStart;
            float distanceInRange = distance - damageDropoffStart;
            return Mathf.Lerp(1f, 0.2f, distanceInRange / dropoffRange);
        }

        protected override void OnHit(RaycastHit hit)
        {
            // Override base OnHit since we handle damage in OnPelletHit
        }
    }
}